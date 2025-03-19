const QUERY_KEYS = {
  userTokens: (walletAddress: string) => ["userTokens", walletAddress],
  userAuthentication: (walletAddress: string) => [
    "userAuthentication",
    walletAddress,
  ],
};

export default QUERY_KEYS;
