const dotenv = require('dotenv');
const { Connection, PublicKey } = require('@solana/web3.js');
const { Decimal } = require('decimal.js');

const ALCHEMY_API_URL = `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const connection = new Connection(ALCHEMY_API_URL);

dotenv.config();

async function getTokenMetadata(tokenAddress) {
    const tokenPublicKey = new PublicKey(tokenAddress);

    // Get the account info
    const accountInfo = await connection.getParsedAccountInfo(tokenPublicKey);

    if (accountInfo.value) {
        const data = accountInfo.value.data['parsed'];
        return {
            mint: data.info.mint,
            owner: data.info.owner,
            tokenAmount: data.info.tokenAmount ? new Decimal(data.info.tokenAmount.uiAmount).toString() : 'N/A',
            decimals: data.info.tokenAmount ? data.info.tokenAmount.decimals : 'N/A',
            symbol: data.info.symbol || 'N/A',
            name: data.info.name || 'N/A'
        };
    } else {
        throw new Error('Token account not found');
    }
}

async function getSolanaUSD() {
    var response = (await axios.get("https://api.coincap.io/v2/assets/solana")).data;

    return new Decimal(response['data']['priceUsd']);
}

async function getSolHoldings(walletAddress) {
    const walletPublicKey = new PublicKey(walletAddress);

    // Get the account balance
    const balance = await connection.getBalance(walletPublicKey);
    // Convert lamports to SOL
    const solBalance = new Decimal(balance).dividedBy(new Decimal(Math.pow(10, 9)));

    const solBalanceUSD = solBalance.times(getSolanaUSD());

    return { solBalance, solBalanceUSD };
}

module.exports = {
    getTokenMetadata,
    getSolHoldings,
    getSolanaUSD
};