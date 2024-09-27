import { PENDING_TRANSACTIONS, TRANSACTIONS } from "@/services/api";
import instance from "@/services/instance";

export const fetchAllTransactions = async () => {
  const res = await instance.get(`${TRANSACTIONS}`);
  return res.data;
};

export const fetchPendingTransactions = async () => {
  const res = await instance.get(`${PENDING_TRANSACTIONS}`);
  return res.data;
};

export const fetchSingleTransaction = async (id: string) => {
  const res = await instance.get(`${TRANSACTIONS}/${id}`);
  return res.data;
};
