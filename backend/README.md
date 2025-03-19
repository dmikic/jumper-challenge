# Jumper Challenge Backend App

This is the backend application created for the Jumper Challenge.

## Getting Started

### Step 1: Create an `.env` File

Create a `.env` file in the root folder of the backend app (`/backend/.env`) with the following environment variables:

```env
PORT=3002
ALCHEMY_API_KEY=
REDIS_PORT=18519
REDIS_HOST=
REDIS_USERNAME=
REDIS_PASSWORD=
```

> **Note:** Missing environment variables will be provided in a separate file upon task submission.

### Step 2: Run the Development Server

Start the backend development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Access the Backend

Open [http://localhost:3002](http://localhost:3002) in your browser to verify the backend is running.

### Backend Endpoints

- **`/signup`**: Called when a user signs a message on-chain and persists user info in Redis.
- **`/tokens/address/:walletAddress`**: Fetch all user tokens.
- **`/auth/:walletAddress`**: Fetch the signup status of a user.
- **`/users`**: Fetch all signed-up users.

Once the backend is running, you can proceed to the frontend dApp.
