import { ALCHEMY_API_URL } from '../constants/alchemyApi';

export const getErc20TokenBalancesInWallet = async (address: string) => {
    try {
        const tokenListBody = JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params: [address],
        });

        const resp = await fetch(`${ALCHEMY_API_URL}${process.env.ALCHEMY_API_KEY}`, {
            method: 'POST',
            body: tokenListBody,
        });

        const data = await resp.json();
        const tokenInfo = data.result.tokenBalances;

        const promises = tokenInfo.map((token: any) => {
            const tokenInfoBody = JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                method: 'alchemy_getTokenMetadata',
                params: [token.contractAddress],
            });

            const promise = fetch(`${ALCHEMY_API_URL}${process.env.ALCHEMY_API_KEY}`, {
                method: 'POST',
                body: tokenInfoBody,
            });

            return promise;
        });

        const responses = await Promise.all(promises).then((res) => Promise.all(res.map((res) => res.json())));

        const tokens = responses.map((tokenInfoRaw: any, index: number) => {
            const token = tokenInfoRaw.result;
            const tokenBalanceRaw = tokenInfo[index].tokenBalance;

            return {
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
                balance: tokenBalanceRaw,
            };
        });

        return tokens;
    } catch (error) {
        console.log('Error fetching ERC20 token balances', error);
        return error;
    }
};
