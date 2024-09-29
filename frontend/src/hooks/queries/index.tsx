import {
  fetchAllTransactions,
  fetchPendingTransactions,
  fetchSingleTransaction,
} from "@/services/queries";
import { SENTINEL_NFT_ADDRESS, client } from "@/utils/contract";
import { SENTINEL_NFT_ABI } from "@/utils/nft";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchAllTransactions(),
    select: (res) => res,
  });
};

export const useFetchPendingTransactions = () => {
  return useQuery({
    queryKey: ["pending-transactions"],
    queryFn: () => fetchPendingTransactions(),
    select: (res) => res,
    refetchInterval: 3 * 1000,
  });
};

export const useFetchSingleTransaction = (id: string) => {
  return useQuery({
    queryKey: ["single-transaction", id],
    queryFn: () => fetchSingleTransaction(id),
    select: (res) => res,
    enabled: !!id,
  });
};

// export const useNFTBalance = (address: string) => {
//   return useQuery({
//     queryKey: ['nftBalance', address],
//     queryFn: async () => {
//       const balance = await client.readContract({
//         address: SENTINEL_NFT_ADDRESS,
//         abi: SENTINEL_NFT_ABI,
//         functionName: "balanceOf",
//         args: [address],
//       });
//       return balance;
//     },
//     select: (data) => Number(data),
//     enabled: !!address,
//   });
// };