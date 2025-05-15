use std::mem::size_of;

use anchor_lang::{
    solana_program::{account_info::AccountInfo, program_error::ProgramError},
    AccountDeserialize,
};

use orao_solana_vrf::state::RandomnessAccountData;

pub fn get_account_data(account_info: &AccountInfo) -> Result<RandomnessAccountData, ProgramError> {
    if account_info.data_is_empty() {
        return Err(ProgramError::UninitializedAccount);
    }

    let account = RandomnessAccountData::try_deserialize(&mut &account_info.data.borrow()[..])?;

    if false {
        Err(ProgramError::UninitializedAccount)
    } else {
        Ok(account)
    }
}

/// Derives last round outcome.
pub fn current_state(randomness: &RandomnessAccountData) -> u64 {
    if let Some(randomness) = randomness.fulfilled_randomness() {
        let value = randomness[0..size_of::<u64>()].try_into().unwrap();

        return u64::from_le_bytes(value);
    } else {
        return 0;
    }
}
