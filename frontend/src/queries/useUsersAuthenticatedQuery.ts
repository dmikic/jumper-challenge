import { USERS_AUTHENTICATED } from "@/constants/backendEndpoints";
import QUERY_KEYS from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

const useUsersAuthenticated = () => {
  return useQuery({
    queryKey: QUERY_KEYS.usersAuthenticated(),
    queryFn: async () => {
      const response = await fetch(`${USERS_AUTHENTICATED}`);
      const data = await response.json();

      const mappedUserData = new Map(data);
      const processedUserData = Array.from(mappedUserData.keys())
        .map((walletAddress) => {
          const signUpDate = (mappedUserData.get(walletAddress) as any)
            .loginDate;
          return {
            walletAddress,
            signUpDate: new Date(signUpDate),
          };
        })
        .sort(
          (userA, userB) =>
            userA.signUpDate.getTime() - userB.signUpDate.getTime()
        );

      return processedUserData;
    },
  });
};

export default useUsersAuthenticated;
