use anchor_lang::{prelude::*, AnchorDeserialize, AnchorSerialize};

#[account]
#[derive(Debug)]
pub struct GameGround {
    pub creator: Pubkey,
    pub game_round: u64,

    pub create_date: i64,
    pub start_date: i64,
    pub end_date: i64,
    pub round_time: i64,

    pub total_deposit: u64,
    pub rand: u64,
    pub winner: Pubkey,
    pub user_count: u64,
    pub min_deposit_amount: u64,
    pub max_joiner_count: u64,

    pub force: [u8; 32],
    pub is_completed: bool,
    pub is_claimed: bool,

    pub deposit_list: Vec<DepositInfo>,
}

impl GameGround {
    pub const INIT_SPACE: usize = 32 + // creator
        8 +  // game_round
        8 +  // create_date
        8 +  // start_date
        8 +  // end_date
        8 +  // round_time
        8 +  // total_deposit
        8 +  // rand
        32 + // winner
        8 +  // user_count
        8 +  // min_deposit_amount
        8 +  // max_joiner_count
        32 + // force [u8; 32]
        1 +  // is_completed (bool)
        1 +  // is_claimed (bool)
        (24 + 40); // Vec length prefix (for deposit_list)

    pub fn space(len: usize) -> usize {
        8 + Self::INIT_SPACE + len * (32 + 8)
    }
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize, InitSpace)]
pub struct DepositInfo {
    pub user: Pubkey,
    pub amount: u64,
}

impl DepositInfo {
    pub const INIT_SPACE: usize = 32 + // user Pubkey
        8; // amount
}

pub trait GameGroundAccount<'info> {
    fn append(&mut self, entrant: Pubkey, amount: u64);

    fn set_winner(&mut self, random_num: u64) -> Result<()>;
}

impl<'info> GameGroundAccount<'info> for Account<'info, GameGround> {
    fn append(&mut self, user: Pubkey, amount: u64) {
        if let Some(deposit) = self.deposit_list.iter_mut().find(|d| d.user == user) {
            // If the user already exists, add to their amount
            deposit.amount += amount;
        } else {
            // If user doesn't exist, add a new entry
            self.deposit_list.push(DepositInfo { user, amount });
            self.user_count += 1;
        }
        self.total_deposit += amount;
    }

    fn set_winner(&mut self, random_num: u64) -> Result<()> {
        self.rand = random_num;
        let mut remaining = self.rand % self.total_deposit;

        for deposit in &self.deposit_list {
            if remaining > deposit.amount {
                remaining -= deposit.amount;
            } else {
                self.winner = deposit.user;
                msg!("winner: {:?}", self.winner);
                break;
            }
        }

        Ok(())
    }
}
