"use client";

import useUsersAuthenticated from "@/queries/useUsersAuthenticatedQuery";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [allUsers, setAllUsers] = useState<any[] | undefined>();

  const usersAuthenticatedQuery = useUsersAuthenticated();

  useEffect(() => {
    if (usersAuthenticatedQuery.isSuccess && usersAuthenticatedQuery.data) {
      setAllUsers(usersAuthenticatedQuery.data);
    }
  }, [usersAuthenticatedQuery.isSuccess, usersAuthenticatedQuery.data]);

  return (
    <div className="flex items-center justify-center min-h-full text-center">
      {usersAuthenticatedQuery.isError ? (
        <div>Something went wrong!</div>
      ) : usersAuthenticatedQuery.isLoading ? (
        <div>Loading...</div>
      ) : allUsers?.length == 0 ? (
        <div>No tokens found in the connected wallet</div>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Wallet</th>
              <th className="border border-gray-400 px-4 py-2">
                Signed up on:
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((user, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
              >
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {index + 1}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {user.walletAddress}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-white">
                  {user.signUpDate.toISOString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
