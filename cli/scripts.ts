import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import fs from "fs";

import { Keypair, Connection, PublicKey } from "@solana/web3.js";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

import { JackpotSmartContract } from "../target/types/jackpot_smart_contract";
import {
    createConfigTx,
    createGameTx,
    setWinnerTx,
    claimRewardTx,
    joinGameTx
} from "../lib/scripts";
import { execTx } from "../lib/util";
import {
    SEED_CONFIG,
    TEST_INITIAL_MAX_JOINER_COUNT,
    TEST_INITIAL_PLATFORM_FEE,
    TEST_INITIAL_MIN_DEPOSIT_AMOUNT,
    GAME_GROUND,
} from "../lib/constant";


let solConnection: Connection = null;
let program: Program<JackpotSmartContract> = null;
let payer: NodeWallet = null;
let provider: anchor.Provider = null;
let feePayer: NodeWallet = null;
let feePayerWalletKeypair: Keypair = null;
let teamWallet: PublicKey = null;
// Address of the deployed program.
let programId;

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
    cluster: web3.Cluster,
    keypair: string,
    rpc?: string
) => {
    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    const walletKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(keypair, "utf-8"))),
        { skipValidation: true }
    );
    payer = new NodeWallet(walletKeypair);

    feePayerWalletKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync("./keys/feePayer.json", "utf-8"))),
        { skipValidation: true }
    );
    feePayer = new NodeWallet(feePayerWalletKeypair);

    teamWallet = new PublicKey("EgBcC7KVQTh1QeU3qxCFsnwZKYMMQkv6TzgEDkKvSNLv");

    console.log("Wallet Address: ", payer.publicKey.toBase58());

    anchor.setProvider(
        new anchor.AnchorProvider(solConnection, payer, {
            skipPreflight: true,
            commitment: "confirmed",
        })
    );

    provider = anchor.getProvider();

    // Generate the program client from IDL.
    program = anchor.workspace.JackpotSmartContract as Program<JackpotSmartContract>;
    programId = program.programId.toBase58();
    console.log("ProgramId: ", program.programId.toBase58());
};

export const configProject = async () => {
    console.log("configProject start");
    const authority = new PublicKey("EgBcC7KVQTh1QeU3qxCFsnwZKYMMQkv6TzgEDkKvSNLv");
    const payerWallet = new PublicKey("8XuXAgPc6zJ37ThVfJ5yLcuLFZ3GoK55zH6iUtZ8oBwN");

    const [configPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    );

    const configAccount = await program.account.config.fetch(configPda);
    console.log("configPda", configAccount);

    // Create a dummy config object to pass as argument.
    const newConfig = {
        authority: authority,//payer.publicKey,

        payerWallet: payerWallet, //payer.publicKey,
        teamWallet: teamWallet, //payer.publicKey,

        gameRound: configAccount.gameRound,
        platformFee: new BN(TEST_INITIAL_PLATFORM_FEE), // Example fee: 1%
        minDepositAmount: new BN(TEST_INITIAL_MIN_DEPOSIT_AMOUNT), //Example 0.1SOL
        maxJoinerCount: new BN(TEST_INITIAL_MAX_JOINER_COUNT), //Example 100

        initialized: false,
    };

    const tx = await createConfigTx(
        payer.publicKey,
        newConfig,
        solConnection,
        program
    );

    await execTx(tx, solConnection, payer);
};

export const createGame = async (
    roundTime: number,
    minDepositAmount: number,
    maxJoinerCount: number) => {
    const configPda = PublicKey.findProgramAddressSync(
        [Buffer.from(SEED_CONFIG)],
        program.programId
    )[0];
    const configAccount = await program.account.config.fetch(configPda);

    const tx = await createGameTx(

        payer.publicKey,
        feePayerWalletKeypair,

        roundTime,
        minDepositAmount,
        maxJoinerCount,

        solConnection,
        program
    );

    await execTx(tx, solConnection, payer);
};

export const setWinner = async (roundNum: number) => {
    const tx = await setWinnerTx(
        payer.publicKey,

        roundNum,

        solConnection,
        program
    );

    await execTx(tx, solConnection, payer);

    const [gameGroundPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GAME_GROUND), new BN(roundNum).toArrayLike(Buffer, "le", 8)],
        program.programId
    );
    console.log("gameGroundPda: ", gameGroundPda);

    const gameGroundAccount = await program.account.gameGround.fetch(gameGroundPda);
    console.log("winner: ", gameGroundAccount.winner);
};

export const claimReward = async (roundNum: number) => {
    const tx = await claimRewardTx(
        payer.publicKey,
        feePayerWalletKeypair,

        roundNum,

        solConnection,
        program
    );

    await execTx(tx, solConnection, payer);


};

export const joinGame = async (roundNum: number, amount: number,) => {
    const tx = await joinGameTx(
        payer.publicKey,
        feePayerWalletKeypair,
        teamWallet,

        roundNum,
        amount,

        solConnection,
        program
    );

    await execTx(tx, solConnection, payer);
};


function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
} 