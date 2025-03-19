import cors from 'cors';
import dotenv from 'dotenv';
import { isAddress, verifyMessage } from 'ethers/lib/utils';
import express, { Express, Request, Response } from 'express';
import Redis from 'ioredis';
import { USER_AUTHENTICATION, USER_SIGN_UP, USER_TOKENS, USERS_AUTHENTICATED } from './constants/endpoints';
import { getErc20TokenBalancesInWallet } from './utils/tokens';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

const redisClient = new Redis({
    port: 18519,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

const port = process.env.PORT || 3002;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
}

app.get('/', (req: Request, res: Response) => {
    res.send(`server is running`);
});

app.put(USER_SIGN_UP, async (req: Request, res: Response) => {
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

    const allUsersString = await redisClient.get('users');

    const allUsers = allUsersString ? new Map(JSON.parse(allUsersString)) : new Map();

    if (allUsers.get(walletAddress)) {
        allUsers.set(walletAddress, { signature: signature, loginDate: new Date().toISOString() });
        await redisClient.set('users', JSON.stringify([...allUsers]));
        res.send(true);
    } else {
        allUsers.set(walletAddress, { signature: signature, loginDate: new Date().toISOString() });
        await redisClient.set('users', JSON.stringify([...allUsers]));
        res.send(true);
    }

    return;
});

app.get(USER_AUTHENTICATION, async (req: Request, res: Response) => {
    const walletAddress = req.params.walletAddress;

    const invalidAddress = !isAddress(walletAddress);
    if (invalidAddress) {
        res.status(400).send('Invalid Ethereum address');
        return;
    }

    const allUsersString = await redisClient.get('users');

    const allUsers = allUsersString ? new Map(JSON.parse(allUsersString)) : new Map();

    if (allUsers.get(walletAddress)) {
        res.send(true);
    } else {
        res.send(false);
    }

    return;
});

app.get(USERS_AUTHENTICATED, async (req: Request, res: Response) => {
    const allUsersString = await redisClient.get('users');

    res.send(allUsersString);
    return;
});

app.get(USER_TOKENS, async (req, res) => {
    const walletAddress = req.params.walletAddress;

    const invalidWalletAddress = !isAddress(walletAddress);

    if (invalidWalletAddress) {
        res.status(400).send('Invalid Ethereum address');
        return;
    }

    const tokenData = await getErc20TokenBalancesInWallet(walletAddress);

    res.send(tokenData);
    return;
});

export default app;
