import { program } from "commander";
import { PublicKey } from "@solana/web3.js";
import {
    configProject,
    setClusterConfig,
    createGame,
    setWinner,
    claimReward,
    joinGame
} from "./scripts";

program.version("0.0.1");

programCommand("config").action(async (directory, cmd) => {
    const { env, keypair, rpc } = cmd.opts();

    console.log("Solana Cluster:", env);
    console.log("Keypair Path:", keypair);
    console.log("RPC URL:", rpc);

    await setClusterConfig(env, keypair, rpc);

    await configProject();
});

programCommand("create")
    .requiredOption("-t, --time <number>", "swap amount")
    .requiredOption("-d, --minDeposit <number>", "min deposit amount")
    .requiredOption("-j, --maxJoiner <number>", "max joiner count")
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, time, minDeposit, maxJoiner } = cmd.opts();

        console.log("Solana Cluster:", env);
        console.log("Keypair Path:", keypair);
        console.log("RPC URL:", rpc);

        await setClusterConfig(env, keypair, rpc);

        await createGame(time, minDeposit, maxJoiner);
    });

programCommand("winner")
    .requiredOption("-g, --roundNum <number>", "Round Number")
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, roundNum } = cmd.opts();

        console.log("Solana Cluster:", env);
        console.log("Keypair Path:", keypair);
        console.log("RPC URL:", rpc);

        await setClusterConfig(env, keypair, rpc);

        await setWinner(roundNum);
    });

programCommand("claim")
    .requiredOption("-g, --roundNum <number>", "Round Number")
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, roundNum } = cmd.opts();

        console.log("Solana Cluster:", env);
        console.log("Keypair Path:", keypair);
        console.log("RPC URL:", rpc);

        await setClusterConfig(env, keypair, rpc);

        await claimReward(roundNum);
    });

programCommand("join")
    .requiredOption("-a, --amount <number>", "swap amount")
    .requiredOption("-g, --roundNum <number>", "Round Number")
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, amount, roundNum } = cmd.opts();

        console.log("Solana Cluster:", env);
        console.log("Keypair Path:", keypair);
        console.log("RPC URL:", rpc);

        await setClusterConfig(env, keypair, rpc);

        await joinGame(roundNum, amount);
    });


function programCommand(name: string) {
    return program
        .command(name)
        .option(
            //  mainnet-beta, testnet, devnet
            "-e, --env <string>",
            "Solana cluster env name",
            "devnet"
        )
        .option(
            "-r, --rpc <string>",
            "Solana cluster RPC name",
            "https://api.devnet.solana.com"
        )
        .option(
            "-k, --keypair <string>",
            "Solana wallet Keypair Path",
            "./keys/EcagE8oN5WLAbEUBmALRqRA7H5auvRLbt8ve8Nf3atX4.json"
        );
}

program.parse(process.argv);

/*

  yarn script config
  yarn script create -t 60 -d 100000000 -j 100
  yarn script join -a 100000000 -g 2
  yarn script winner -g 2
  yarn script claim -g 2
  
*/