import {
    Transaction,
    Connection,
} from "@solana/web3.js";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export const execTx = async (
    transaction: Transaction,
    connection: Connection,
    payer: NodeWallet,
    commitment: "confirmed" | "finalized" = 'confirmed'
) => {
    try {
        //  Sign the transaction with payer wallet
        const signedTx = await payer.signTransaction(transaction);

        // Serialize, send and confirm the transaction
        const rawTransaction = signedTx.serialize()

        console.log(await connection.simulateTransaction(signedTx));

        // return;
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2,
            preflightCommitment: "processed"
        });
        console.log(`https://solscan.io/tx/${txid}?cluster=custom&customUrl=${connection.rpcEndpoint}`);

        const confirmed = await connection.confirmTransaction(txid, commitment);

        console.log("err ", confirmed.value.err)
    } catch (e) {
        console.log(e);
    }
}
