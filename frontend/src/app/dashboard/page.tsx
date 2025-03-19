"use client";

import useUserTokensQuery from "@/queries/useUserTokensQuery";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { address, isConnected, chain } = useAccount();
  const [userTokens, setUserTokens] = useState<any[] | undefined>();

  const userTokensQuery = useUserTokensQuery(
    address ?? "",
    isConnected && chain?.id === 1
  );

  useEffect(() => {
    if (userTokensQuery.isSuccess && userTokensQuery.data) {
      setUserTokens(userTokensQuery.data);
    }
  }, [
    address,
    chain,
    isConnected,
    userTokensQuery.isSuccess,
    userTokensQuery.data,
  ]);

  return (
    <div className="flex items-center justify-center min-h-full text-center">
      {!isConnected ? (
        <label>Welcome, please connect a wallet first</label>
      ) : userTokensQuery.isError ? (
        <div>Something went wrong!</div>
      ) : userTokensQuery.isLoading ? (
        <div>Loading...</div>
      ) : userTokens?.length == 0 ? (
        <div>No tokens found in the connected wallet</div>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-400 px-4 py-2">Token</th>
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {userTokens?.map((token, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
              >
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {token.symbol}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {token.name}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {token.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
