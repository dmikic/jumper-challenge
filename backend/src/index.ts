import dotenv from 'dotenv';
import { isAddress, verifyMessage } from 'ethers/lib/utils';
import express, { Express, Request, Response } from 'express';
import { USER_AUTHENTICATE, USER_TOKENS } from './constants/endpoints';
import { getErc20TokenBalancesInWallet } from './utils/tokens';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});

app.get(USER_AUTHENTICATE, (req: Request, res: Response) => {
    const walletAddress = req.body.walletAddress;
    const signature = req.body.signature;
    const message = req.body.message;

    if (!walletAddress || !signature || !message) {
        res.status(400).send('Missing required fields');
        return;
    }

    const invalidAddress = !isAddress(walletAddress);

    if (invalidAddress) {
        res.status(400).send('Invalid Ethereum address');
        return;
    }

    const signerAdress = verifyMessage(message, signature);
    if (signerAdress !== walletAddress) {
        res.status(400).send('Signer address does not match wallet address');
        return;
    }

    res.send(true);
});

app.get(USER_TOKENS, async (req, res) => {
    const walletAddress = req.params.walletAddress;

    const invalidWalletAddress = !isAddress(walletAddress);

    if (invalidWalletAddress) {
        res.status(400).send('Invalid Ethereum address');
        return;
    }

    const tokenData = await getErc20TokenBalancesInWallet(walletAddress);

    console.log(tokenData);
    res.send(tokenData);
});

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
