import {
  fetchAllTransactions,
  fetchPendingTransactions,
  fetchSingleTransaction,
} from "@/services/queries";
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
