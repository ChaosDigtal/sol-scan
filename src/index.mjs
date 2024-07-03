import { getTokenMetadata, getSolHoldings } from './solUtil.mjs';
(async () => {
    try {
        const tokenAddress = 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux';
        const walletAddress = 'D96EFRTeN2PSxqUfiHEQyKmwHLAE39Lcq23W2v5FJi8V';

        const metadata = await getTokenMetadata(tokenAddress);
        console.log('Token Metadata:', metadata);

        const solHoldings = await getSolHoldings(walletAddress);
        console.log(`SOL Balance: ${solHoldings.solBalance}`);
        console.log(`SOL Balance(USD): $${solHoldings.solBalanceUSD}`);
    } catch (error) {
        console.error('Error:', error);
    }
})();