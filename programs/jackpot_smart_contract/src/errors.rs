use anchor_lang::prelude::*;

pub use ContractError::*;

#[error_code]
pub enum ContractError {
    #[msg("ValueTooSmall")]
    ValueTooSmall,

    #[msg("ValueTooLarge")]
    ValueTooLarge,

    #[msg("ValueInvalid")]
    ValueInvalid,

    #[msg("IncorrectAuthority")]
    IncorrectAuthority,

    #[msg("IncorrectTeamWalletAuthority")]
    IncorrectTeamWalletAuthority,

    #[msg("IncorrectPayerAuthority")]
    IncorrectPayerAuthority,

    #[msg("IncorrectConfigAccount")]
    IncorrectConfigAccount,

    #[msg("Overflow or underflow occured")]
    OverflowOrUnderflowOccurred,

    #[msg("Amount is invalid")]
    InvalidAmount,

    #[msg("Incorrect team wallet address")]
    IncorrectTeamWallet,

    #[msg("Can not deposit after the game is completed")]
    GameAlreadyCompleted,

    #[msg("Already set winner")]
    SetWinnerCompleted,

    #[msg("Game is not completed")]
    GameNotCompleted,

    #[msg("Winner already claimed")]
    WinnerClaimed,

    #[msg("Return amount is too small compared to the minimum received amount")]
    ReturnAmountTooSmall,

    #[msg("Global Not Initialized")]
    NotInitialized,

    #[msg("Invalid Global Authority")]
    InvalidGlobalAuthority,

    #[msg("Not enough SOL received to be valid.")]
    InsufficientSol,

    #[msg("Arithmetic Error")]
    ArithmeticError,

    #[msg("Math Overflow")]
    MathOverflow,

    #[msg("End time is error")]
    EndTimeError,

    #[msg("Round time is error")]
    RoundTimeError,

    #[msg("Minimum Deposit Amount is error")]
    MinDepositAmountError,

    #[msg("Maximum Joiner Count is error")]
    MaxJoinerCountError,

    #[msg("User count exceeds the maximum allowed limit")]
    UserCountOverError,

    #[msg("Randomness is still being fulfilled")]
    StillProcessing,

    #[msg("The deposit amount must be more than the minimum deposit amount.")]
    DepositAmountError,

    #[msg("This Round not exist")]
    RoundNumberError,
}
