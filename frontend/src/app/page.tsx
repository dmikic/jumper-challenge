"use client";

import { USER_AUTHENTICATION } from "@/constants/backendEndpoints";
import useUserTokensQuery from "@/queries/useUserTokensQuery";
import { config } from "@/utils/wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signMessage } from "@wagmi/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [userTokens, setUserTokens] = useState<any[] | undefined>();
  const [signingInProgress, setSigningInProgress] = useState<boolean>(false);

  const userTokensQuery = useUserTokensQuery(
    address ?? "",
    isConnected && chain?.id === 1
  );

  useEffect(() => {
    if (userTokensQuery.isSuccess && userTokensQuery.data) {
      setUserTokens(userTokensQuery.data);
    }
  }, [
    userTokensQuery.isSuccess,
    userTokensQuery.data,
    chain,
    isConnected,
    address,
  ]);

  const signUp = async () => {
    setSigningInProgress(true);
    const messageText = "Please sign this message to verify ownership";
    await signMessage(config, {
      account: address,
      message: messageText,
    })
      .then(async (signature) => {
        const response = await fetch(USER_AUTHENTICATION, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({
            walletAddress: address,
            signature: signature,
            message: messageText,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (data == true) {
          toast.success("Sign up successful");
        } else {
          toast.error("Sign up failed");
        }

        setSigningInProgress(false);
      })
      .catch((error) => {
        toast.error("Sign up failed");
        console.log(error);
        setSigningInProgress(false);
      });
  };

  return (
    <div className="relative min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4 flex gap-4">
        {isConnected && (
          <button
            disabled={signingInProgress}
            onClick={signUp}
            className={`h-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${
              signingInProgress ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {signingInProgress ? "Signing..." : "Sign up"}
          </button>
        )}
        <ConnectButton />
      </div>
      <div className="flex items-center justify-center min-h-full text-center">
        {!isConnected ? (
          <label>Welcome, please connect a wallet first</label>
        ) : userTokensQuery.isError ? (
          <div>Something went wrong!</div>
        ) : userTokensQuery.isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Token</th>
                <th className="border border-gray-400 px-4 py-2">Name</th>
                <th className="border border-gray-400 px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {userTokens?.map((token, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">
                    {token.symbol}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {token.name}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {token.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
