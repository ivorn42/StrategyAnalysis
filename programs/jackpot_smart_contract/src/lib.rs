use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
// pub mod events;
pub mod instructions;
pub mod misc;
pub mod state;
pub mod utils;

use instructions::{claim_reward::*, configure::*, create_game::*, join_game::*, set_winner::*};

use state::config::*;

declare_id!("DZQyG4Xsgt8vGvaWEPHyTgzmHYz4V9qrw7eirpBidXU9");

#[program]
pub mod jackpot_smart_contract {

    use super::*;

    pub fn configure(ctx: Context<Configure>, new_config: Config) -> Result<()> {
        msg!("configure: {:#?}", new_config);
        ctx.accounts.handler(new_config, ctx.bumps.config)
    }

    pub fn create_game(
        ctx: Context<CreateGame>,
        force: [u8; 32],
        round_time: i64,
        min_deposit_amount: u64,
        max_joiner_count: u64,
    ) -> Result<()> {
        ctx.accounts
            .handler(force, round_time, min_deposit_amount, max_joiner_count)
    }

    pub fn set_winner(ctx: Context<SetWinner>, round_num: u64) -> Result<()> {
        ctx.accounts.handler(round_num)
    }

    pub fn join_game(ctx: Context<JoinGame>, round_num: u64, amount: u64) -> Result<()> {
        ctx.accounts.handler(round_num, amount)
    }

    pub fn claim_reward(ctx: Context<ClaimReward>, round_num: u64) -> Result<()> {
        ctx.accounts.handler(round_num, ctx.bumps.global_vault)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
