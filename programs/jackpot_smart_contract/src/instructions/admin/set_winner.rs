use crate::{
    constants::{CONFIG, GAME_GROUND, GLOBAL},
    errors::*,
    misc::*,
    state::{config::*, gameground::*},
};
use anchor_lang::{prelude::*, system_program};
use orao_solana_vrf::RANDOMNESS_ACCOUNT_SEED;

#[derive(Accounts)]
#[instruction(round_num: u64)]
pub struct SetWinner<'info> {
    #[account(
        mut,
        seeds = [CONFIG.as_bytes()],
        bump,
    )]
    global_config: Box<Account<'info, Config>>,

    /// CHECK: global vault pda which stores SOL
    #[account(
        mut,
        seeds = [GLOBAL.as_bytes()],
        bump,
    )]
    pub global_vault: AccountInfo<'info>,

    #[account(mut,
    constraint = global_config.authority == creator.key() @ ContractError::IncorrectAuthority)]
    creator: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_GROUND.as_bytes(), round_num.to_le_bytes().as_ref()],
        bump
    )]
    game_ground: Box<Account<'info, GameGround>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [RANDOMNESS_ACCOUNT_SEED, &game_ground.force],
        bump,
        seeds::program = orao_solana_vrf::ID
    )]
    pub random: AccountInfo<'info>,

    #[account(address = system_program::ID)]
    system_program: Program<'info, System>,
}

impl<'info> SetWinner<'info> {
    pub fn handler(&mut self, round_num: u64) -> Result<()> {
        require!(
            round_num < self.global_config.game_round,
            ContractError::RoundNumberError
        );

        let game_ground = &mut self.game_ground;
        let timestamp = Clock::get()?.unix_timestamp;

        require!(
            game_ground.end_date <= timestamp,
            ContractError::GameNotCompleted
        );
        require!(
            game_ground.is_completed == false,
            ContractError::SetWinnerCompleted
        );

        let rand_acc = crate::misc::get_account_data(&self.random)?;

        let randomness = current_state(&rand_acc);
        if randomness == 0 {
            return err!(ContractError::StillProcessing);
        }

        game_ground.set_winner(randomness)?;
        game_ground.is_completed = true;

        Ok(())
    }
}
