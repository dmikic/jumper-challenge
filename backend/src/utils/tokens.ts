import { ALCHEMY_API_URL } from '../constants/alchemyApi';

export const getErc20TokenBalancesInWallet = async (address: string) => {
    try {
        const body = JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params: [address, 'erc20'],
        });

        const resp = await fetch(`${ALCHEMY_API_URL}${process.env.ALCHEMY_API_KEY}`, {
            method: 'POST',
            body: body,
        });

        const data = await resp.json();
        return data;
    } catch (error) {
        console.log('Error fetching ERC20 token balances', error);
        return error;
    }
};
