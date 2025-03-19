import { USER_TOKENS } from "@/constants/backendEndpoints";
import QUERY_KEYS from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { fromHex } from "viem";

const useUserTokensQuery = (
  walletAddress: string,
  isWalletConnected: boolean
) => {
  return useQuery({
    queryKey: QUERY_KEYS.userTokens(walletAddress),
    queryFn: async () => {
      const response = await fetch(`${USER_TOKENS}${walletAddress}`);
      const responseData = await response.json();

      const data = responseData
        .map((tokenInfo: any) => {
          return {
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            balance: (
              fromHex(tokenInfo.balance, "number") /
              Math.pow(10, tokenInfo.decimals)
            ).toFixed(2),
          };
        })
        .filter(
          (token: any) => token.balance > 0.001 && token.name && token.symbol
        )
        .sort((tokenA: any, tokenB: any) => tokenB.balance - tokenA.balance);

      return data;
    },
    enabled: isWalletConnected,
  });
};

export default useUserTokensQuery;
