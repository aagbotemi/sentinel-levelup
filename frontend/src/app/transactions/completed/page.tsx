"use client";

import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import { Table } from "@/components/Table";
import { useFetchAllTransactions } from "@/hooks/queries";
import useCommaFormatter, { collapseHash } from "@/hooks";
import { SingleTransaction } from "@/components/SingleTransaction";
import Navbar from "@/components/Navbar";

const Transactions = () => {
  const [showSingleTransaction, setShowSingleTransaction] =
    useState<string>("");

  const { formatWithCommas } = useCommaFormatter();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const { data, isPending } = useFetchAllTransactions();

  const filteredValue = data?.filter((d: { tx_hash: string }) =>
    d?.tx_hash?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const tableData = filteredValue
    ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    ?.map((trx: any) => ({
      id: trx?.id,
      data: trx,
      "Transaction Hash": collapseHash(trx?.tx_hash),
      From: collapseHash(trx?.from_sender),
      To: collapseHash(trx?.to_reciever),
      "Contract Type": trx?.contract_type?.replace(/([A-Z])/g, " $1").trim(),
      "Mempool Time (ms)": trx?.mempool_time,
    }));

  const handleRow = async (val: { id: string }) => {
    setShowSingleTransaction(val.id);
  };

  return (
    <div className="bg-[#0c0c0c] text-white p-5 w-screen h-screen overflow-y-auto">
      <div className=" mx-auto bg-transparent h-full w-full overflow-y-auto  rounded-[16px] relative overflow-hidden border-[5px] border-[#A270FF] border-opacity-[30%]  lg:p-[40px] p-[20px] drop-shadow-xl">
        <div className="w-[1208px] h-[656px] bg-[#A270FF] opacity-[100%] rounded-full -rotate-[22.34deg] blur-[332.36px] absolute left-[300.13px] top-[250.42px] z-0"></div>

        <Navbar />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 justify-between my-5 w-full">
          <span className="font-semibold text-lg leading-6">
            Completed Transactions{" "}
            <span className="text-[#f4f4f4] bg-[#A270FF] px-2 py-1 ms-2 rounded-full w-6 h-4 text-sm font-medium">
              {formatWithCommas(filteredValue?.length) ?? 0}
            </span>
          </span>
          <div className="min-w-full md:min-w-[20%]">
            <SearchInput
              placeholder={"Search by Transaction Hash"}
              handleSearch={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              deleteSearchValue={() => setSearchValue("")}
              disabled={false}
            />
          </div>
        </div>
        <Table
          handleClickRow={(val) => handleRow(val)}
          tableHeaders={[
            "Transaction Hash",
            "From",
            "To",
            "Contract Type",
            "Mempool Time (ms)",
          ]}
          tableData={tableData}
          emptyTitle={"No completed transactions available"}
          hasPagination
          handlePagination={(e) => {
            setCurrentPage(e);
          }}
          itemsPerPage={itemsPerPage}
          totalItems={filteredValue?.length}
          loading={isPending}
          currentPage={currentPage}
          setItemsPerPage={setItemsPerPage}
        />
        {showSingleTransaction && (
          <SingleTransaction
            show={showSingleTransaction}
            onClose={() => setShowSingleTransaction("")}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
