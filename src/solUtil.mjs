import dotenv from 'dotenv';
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import web3 from '@solana/web3.js';
import { Decimal } from 'decimal.js';
import { getMint } from '@solana/spl-token';
import Metadata from "@metaplex-foundation/mpl-token-metadata";

dotenv.config();

const connection_solana = new Connection('https://twilight-dawn-fire.solana-mainnet.quiknode.pro/1fee75c577db3bf813ffb25df1c403d9a6cc5df4'); // or any other Solana RPC endpoint
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export async function getTokenMetadata(tokenMintAddress) {

    const mintAddress = new web3.PublicKey(tokenMintAddress);
    const mintInfo = await getMint(connection_solana, mintAddress);
    const decimals = mintInfo.decimals;
    const supply = mintInfo.supply;

    const metadataPDA = await PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            new PublicKey(tokenMintAddress).toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    const metadataAccountInfo = await connection_solana.getAccountInfo(metadataPDA[0]);
    if (metadataAccountInfo) {
        const metadata = Metadata.Metadata.deserialize(metadataAccountInfo.data);
        console.log(metadata[0].data.name);
        return { name: metadata[0].data.name.replace(/\0/g, ''), symbol: metadata[0].data.symbol.replace(/\0/g, ''), decimals: decimals, supply: supply };
    } else {
        throw new Error('Token metadata not found');
    }
}

export async function getSolanaUSD() {
    var response = (await axios.get("https://api.coincap.io/v2/assets/solana")).data;

    return new Decimal(response['data']['priceUsd']);
}

export async function getSolHoldings(walletAddress) {
    const walletPublicKey = new PublicKey(walletAddress);

    // Get the account balance
    const balance = await connection_solana.getBalance(walletPublicKey);
    // Convert lamports to SOL
    const solBalance = new Decimal(balance).dividedBy(new Decimal(Math.pow(10, 9)));

    const solBalanceUSD = solBalance.times(await getSolanaUSD());

    return { solBalance, solBalanceUSD };
}