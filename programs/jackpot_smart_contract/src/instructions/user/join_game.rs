use crate::{
    constants::{CONFIG, GAME_GROUND, GLOBAL},
    errors::*,
    state::{config::*, gameground::*},
    utils::*,
};
use anchor_lang::{prelude::*, system_program};

#[derive(Accounts)]
#[instruction(round_num: u64)]
pub struct JoinGame<'info> {
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

    /// CHECK: should be same with the address in the global_config
    #[account(
        mut,
        constraint = global_config.team_wallet == team_wallet.key() @ContractError::IncorrectTeamWalletAuthority
    )]
    pub team_wallet: AccountInfo<'info>,

    #[account(mut)]
    joiner: Signer<'info>,

    #[account(mut,
        constraint = global_config.payer_wallet == payer.key() @ ContractError::IncorrectPayerAuthority)]
    payer: Signer<'info>,

    #[account(
        mut,
        seeds = [GAME_GROUND.as_bytes(), round_num.to_le_bytes().as_ref()],
        bump
    )]
    game_ground: Box<Account<'info, GameGround>>,

    #[account(address = system_program::ID)]
    system_program: Program<'info, System>,
}

impl<'info> JoinGame<'info> {
    pub fn handler(&mut self, round_num: u64, amount: u64) -> Result<()> {
        if amount <= 0 {
            return err!(ContractError::InvalidAmount);
        }

        require!(
            round_num < self.global_config.game_round,
            ContractError::RoundNumberError
        );

        let game_ground = &mut self.game_ground;
        require!(
            amount >= game_ground.min_deposit_amount,
            ContractError::DepositAmountError
        );

        let timestamp = Clock::get()?.unix_timestamp;

        if game_ground.user_count > 2 {
            require!(
                game_ground.end_date > timestamp,
                ContractError::GameAlreadyCompleted
            );

            require!(
                game_ground.is_completed == false,
                ContractError::GameAlreadyCompleted
            );
        }

        let global_config = &mut self.global_config;
        let team_wallet = &mut self.team_wallet;
        let source = &mut self.global_vault.to_account_info();

        let depoist_amount_applied: u64;
        let platform_fee_lamports = bps_mul(global_config.platform_fee, amount, 10_000).unwrap();

        depoist_amount_applied = amount
            .checked_sub(platform_fee_lamports)
            .ok_or(ContractError::InvalidAmount)?;

        // transfer sol to market
        sol_transfer_from_user(
            &self.joiner,
            source.clone(),
            &self.system_program,
            depoist_amount_applied,
        )?;

        if platform_fee_lamports > 0 {
            //Transfer SOL to team_wallet
            sol_transfer_from_user(
                &self.joiner,
                team_wallet.clone(),
                &self.system_program,
                platform_fee_lamports,
            )?;
        }

        resize_account(
            game_ground.to_account_info().clone(),
            GameGround::space(game_ground.deposit_list.len() as usize),
            self.payer.to_account_info().clone(),
            self.system_program.to_account_info().clone(),
        )?;

        game_ground.append(self.joiner.key(), depoist_amount_applied);

        if game_ground.user_count == 2 {
            game_ground.start_date = timestamp;
            game_ground.end_date = game_ground.start_date + game_ground.round_time;
        }

        require!(
            game_ground.max_joiner_count >= game_ground.user_count,
            ContractError::UserCountOverError
        );

        Ok(())
    }
}
