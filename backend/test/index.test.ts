import request from 'supertest';
import { USER_AUTHENTICATE } from '../src/constants/endpoints';
import app from '../src/index';

process.env.NODE_ENV = 'test';
describe('Check user tokens endpoint', () => {
    it('test if wallet address is valid', async () => {
        const walletAddress = 'addy';
        const apiResponse = await request(app).get(`/tokens/address/${walletAddress}`);
        expect(apiResponse.status).toBe(400);
    });
});

describe('Check user authentication endpoint', () => {
    it('test if body fields are valid', async () => {
        const apiResponse = await request(app)
            .put(USER_AUTHENTICATE)
            .send({ walletAddress: 'addy', signature: '', message: 'msg' });

        expect(apiResponse.status).toBe(400);
        expect(apiResponse.text).toBe('Missing required fields');
    });

    it('test if wallet address is valid', async () => {
        const apiResponse = await request(app)
            .put(USER_AUTHENTICATE)
            .send({ walletAddress: 'addy', signature: 'sig', message: 'msg' });

        expect(apiResponse.status).toBe(400);
        expect(apiResponse.text).toBe('Invalid Ethereum address');
    });
});
