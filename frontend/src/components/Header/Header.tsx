"use client";

import { USER_SIGN_UP } from "@/constants/backendEndpoints";
import useUserAuthenticationQuery from "@/queries/useUserAuthenticationQuery";
import { config } from "@/utils/wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signMessage } from "@wagmi/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export default function Header() {
  const { address, isConnected, chain } = useAccount();

  const [signingInProgress, setSigningInProgress] = useState<boolean>(false);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  const userAuthenticationQuery = useUserAuthenticationQuery(
    address ?? "",
    isConnected && chain?.id === 1
  );

  useEffect(() => {
    if (
      userAuthenticationQuery.isSuccess &&
      userAuthenticationQuery.data != undefined
    ) {
      setUserAuthenticated(userAuthenticationQuery.data);
    }
  }, [
    address,
    chain,
    isConnected,
    userAuthenticationQuery.isSuccess,
    userAuthenticationQuery.data,
  ]);

  const signUp = async () => {
    setSigningInProgress(true);
    const messageText = "Please sign this message to verify ownership";
    await signMessage(config, {
      account: address,
      message: messageText,
    })
      .then(async (signature) => {
        const response = await fetch(USER_SIGN_UP, {
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
    <>
      <div className="absolute top-4 left-4 flex gap-4">
        <Link
          href="/dashboard"
          className="h-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-blue-300 flex items-center justify-center"
        >
          Dashboard
        </Link>
        <Link
          href="/leaderboard"
          className="h-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-blue-300 flex items-center justify-center"
        >
          Leaderboard
        </Link>
      </div>
      <div className="absolute top-4 right-4 flex gap-4">
        {isConnected && (
          <button
            disabled={signingInProgress || userAuthenticated}
            onClick={signUp}
            className={`h-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${
              signingInProgress || userAuthenticated
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {signingInProgress
              ? "Signing..."
              : userAuthenticated
              ? "Signed up!"
              : "Sign up"}
          </button>
        )}
        <ConnectButton />
      </div>
    </>
  );
}
