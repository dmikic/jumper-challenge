import { USER_AUTHENTICATION } from "@/constants/backendEndpoints";
import QUERY_KEYS from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

const useUserAuthenticationQuery = (
  walletAddress: string,
  isWalletConnected: boolean
) => {
  return useQuery({
    queryKey: QUERY_KEYS.userAuthentication(walletAddress),
    queryFn: async () => {
      const response = await fetch(`${USER_AUTHENTICATION}${walletAddress}`);
      const data = await response.json();
      return data;
    },
    enabled: isWalletConnected,
  });
};

export default useUserAuthenticationQuery;
