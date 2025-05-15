import { BN, Program } from "@coral-xyz/anchor";
import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from "@solana/web3.js";

import { JackpotSmartContract } from "../target/types/jackpot_smart_contract";
import {
    SEED_CONFIG,
    GAME_GROUND,
} from "./constant";


import { randomnessAccountAddress, networkStateAccountAddress, PROGRAM_ID } from "@orao-network/solana-vrf";


export const createConfigTx = async (
    admin: PublicKey,

    newConfig: any,

    connection: Connection,
    program: Program<JackpotSmartContract>
) => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    );

    console.log("configPda: ", configPda.toBase58());

    const tx = await program.methods
        .configure(newConfig)
        .accounts({
            payer: admin,
        })
        .transaction();


    tx.feePayer = admin;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    return tx;
};

export const createGameTx = async (

    user: PublicKey,
    feePayer: Keypair,

    roundTime: number,
    minDepositAmount: number,
    maxJoinerCount: number,

    connection: Connection,
    program: Program<JackpotSmartContract>
) => {
    const force = Keypair.generate().publicKey;
    console.log("force", force);

    let networkStateAddress = networkStateAccountAddress(PROGRAM_ID);
    console.log("networkStateAddress: ", networkStateAddress);

    const accountData = await program.account.networkState.fetch(networkStateAddress);
    console.log("accountData: ", accountData);

    // Send the transaction to launch a token
    const tx = await program.methods
        .createGame([...force.toBuffer()], new BN(roundTime), new BN(minDepositAmount), new BN(maxJoinerCount))
        .accounts({
            creator: user,
            treasury: accountData.config.treasury,
            payer: feePayer.publicKey,
        })
        .transaction();

    tx.feePayer = feePayer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    tx.sign(feePayer);

    return tx;
};

export const setWinnerTx = async (
    user: PublicKey,

    roundNum: number,


    connection: Connection,
    program: Program<JackpotSmartContract>
) => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    console.log("configAccount: ", configAccount);

    const [gameGroundPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GAME_GROUND), new BN(roundNum).toArrayLike(Buffer, "le", 8)],
        program.programId
    );
    console.log("gameGroundPda: ", gameGroundPda);

    const gameGroundAccount = await program.account.gameGround.fetch(gameGroundPda);
    console.log("gameGroundAccount: ", gameGroundAccount);


    const forceSeed = new Uint8Array(gameGroundAccount.force);
    const random = randomnessAccountAddress(forceSeed);

    const tx = await program.methods
        .setWinner(new BN(roundNum))
        .accounts({
            creator: user,
            random
        })
        .transaction();

    tx.feePayer = user;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    return tx;
};

export const claimRewardTx = async (
    user: PublicKey,
    feePayer: Keypair,

    roundNum: number,

    connection: Connection,
    program: Program<JackpotSmartContract>
) => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);



    const tx = await program.methods
        .claimReward(new BN(roundNum))
        .accounts({
            winner: user,
            payer: feePayer.publicKey,
        })
        .transaction();

    tx.feePayer = feePayer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    tx.sign(feePayer);

    return tx;
};

export const joinGameTx = async (
    user: PublicKey,
    feePayer: Keypair,
    teamWallet: PublicKey,

    roundNum: number,
    amount: number,

    connection: Connection,
    program: Program<JackpotSmartContract>
) => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    const tx = await program.methods
        .joinGame(new BN(roundNum), new BN(amount))
        .accounts({
            joiner: user,
            payer: feePayer.publicKey,
            teamWallet: teamWallet,
        })
        .transaction();

    tx.feePayer = feePayer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    tx.sign(feePayer);

    return tx;
};