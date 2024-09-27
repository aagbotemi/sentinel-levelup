"use client";

import React from "react";
import { Drawer } from "./Drawer";
import { useFetchSingleTransaction } from "@/hooks/queries";
import EachTxRow from "./EachTxRow";
import useCommaFormatter from "@/hooks";

export const SingleTransaction: React.FC<ISingleTransaction> = ({
  onClose,
  show,
}) => {
  const { formatWithCommas } = useCommaFormatter();

  const { data: transaction } = useFetchSingleTransaction(show);

  return (
    <Drawer setShow={onClose} title="Transaction Details" show={show}>
      <div className="flex gap-10">
        <div className="grid gap-5">
          <EachTxRow
            label="Transaction Hash"
            value={transaction?.tx_hash}
            isCopy
          />
          <EachTxRow
            label="Block Hash"
            value={transaction?.block_hash}
            isCopy
          />
          <EachTxRow
            label="Block"
            value={transaction?.block_number}
            isLink="https://etherscan.io/block"
          />
          <EachTxRow label="From" value={transaction?.from_sender} isCopy />
          <EachTxRow label="To" value={transaction?.to_reciever} isCopy />
          <EachTxRow label="Value" value={transaction?.tx_value} />
          <EachTxRow
            label="Gas Price"
            unit="(Gwei)"
            value={formatWithCommas(transaction?.gas_price)}
          />
          <EachTxRow
            label="Nonce"
            value={formatWithCommas(transaction?.nonce)}
          />
          <EachTxRow
            label="Mempool Time"
            unit="(ms)"
            value={transaction?.mempool_time}
          />
        </div>
      </div>
    </Drawer>
  );
};
