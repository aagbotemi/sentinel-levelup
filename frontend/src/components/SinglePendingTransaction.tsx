"use client";

import React from "react";
import { Drawer } from "./Drawer";
import EachTxRow from "./EachTxRow";
import useCommaFormatter from "@/hooks";

export const SinglePendingTransaction: React.FC<ISingleTransaction> = ({
  onClose,
  show,
}) => {
  const { formatWithCommas } = useCommaFormatter();

  const transaction = show;

  return (
    <Drawer setShow={onClose} title="Transaction Details" show={show}>
      <div className="flex gap-10">
        <div className="grid gap-5">
          <EachTxRow
            label="Transaction Hash"
            value={transaction?.pending_tx_hash}
            isCopy
          />

          <EachTxRow
            label="From"
            value={transaction?.pending_from_sender}
            isCopy
          />
          <EachTxRow
            label="To"
            value={transaction?.pending_to_reciever}
            isCopy
          />
          <EachTxRow
            label="Gas Price"
            unit="(Gwei)"
            value={formatWithCommas(transaction?.pending_gas)}
          />
        </div>
      </div>
    </Drawer>
  );
};
