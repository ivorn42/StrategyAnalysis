use crate::errors::*;
use crate::{
    constants::{CONFIG, GLOBAL},
    state::config::*,
    utils::sol_transfer_from_user,
};
use anchor_lang::{prelude::*, system_program, Discriminator};
use borsh::BorshDeserialize;

#[derive(Accounts)]
pub struct Configure<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: initialization handled inside the instruction
    #[account(
        mut,
        seeds = [CONFIG.as_bytes()],
        bump,
    )]
    config: AccountInfo<'info>,

    /// CHECK: global vault pda which stores SOL
    #[account(
        mut,
        seeds = [GLOBAL.as_bytes()],
        bump,
    )]
    pub global_vault: AccountInfo<'info>,

    #[account(address = system_program::ID)]
    system_program: Program<'info, System>,
}

impl<'info> Configure<'info> {
    pub fn handler(&mut self, new_config: Config, config_bump: u8) -> Result<()> {
        let serialized_config =
            [&Config::DISCRIMINATOR, new_config.try_to_vec()?.as_slice()].concat();
        let serialized_config_len = serialized_config.len();
        let config_cost = Rent::get()?.minimum_balance(serialized_config_len);

        //  init config pda
        if self.config.owner != &crate::ID {
            let cpi_context = CpiContext::new(
                self.system_program.to_account_info(),
                system_program::CreateAccount {
                    from: self.payer.to_account_info(),
                    to: self.config.to_account_info(),
                },
            );
            system_program::create_account(
                cpi_context.with_signer(&[&[CONFIG.as_bytes(), &[config_bump]]]),
                config_cost,
                serialized_config_len as u64,
                &crate::ID,
            )?;
        } else {
            let data = self.config.try_borrow_data()?;
            if data.len() < 8 || &data[0..8] != Config::DISCRIMINATOR {
                return err!(ContractError::IncorrectConfigAccount);
            }

            let config = Config::deserialize(&mut &data[8..])?;

            if config.authority != self.payer.key() {
                return err!(ContractError::IncorrectAuthority);
            }
        }

        let lamport_delta = (config_cost as i64) - (self.config.lamports() as i64);
        if lamport_delta > 0 {
            system_program::transfer(
                CpiContext::new(
                    self.system_program.to_account_info(),
                    system_program::Transfer {
                        from: self.payer.to_account_info(),
                        to: self.config.to_account_info(),
                    },
                ),
                lamport_delta as u64,
            )?;
            self.config.realloc(serialized_config_len, false)?;
        }

        (self.config.try_borrow_mut_data()?[..serialized_config_len])
            .copy_from_slice(serialized_config.as_slice());

        //  initialize global vault if needed
        if self.global_vault.lamports() == 0 {
            sol_transfer_from_user(
                &self.payer,
                self.global_vault.clone(),
                &self.system_program,
                1000000,
            )?;
        }
        Ok(())
    }
}
