"use client";

import { FC, useRef } from "react";
import { EmptyData } from "./EmptyData";
import { Pagination } from "./Pagination";

export const Table: FC<ITable> = ({
  tableHeaders,
  tableData,
  handlePagination,
  hasPagination,
  handleClickRow,
  loading,
  emptyTitle,
  emptySubTitle,
  totalItems,
  itemsPerPage,
  currentPage,
  setItemsPerPage,
}) => {
  const dropdownRef = useRef<any>(null);

  const isEmpty = !loading && tableData?.length < 1;

  let tableBody;
  if (loading) {
    tableBody = (
      <tr>
        <td colSpan={tableHeaders?.length} className="text-center">
          loading...
        </td>
      </tr>
    );
  } else if (isEmpty) {
    tableBody = (
      <tr>
        <td colSpan={tableHeaders?.length} className="text-center">
          <EmptyData title={emptyTitle} subTitle={emptySubTitle} />
        </td>
      </tr>
    );
  } else {
    tableBody = tableData?.map((datum) => {
      return (
        <tr
          key={datum.id}
          data-testid="table-body-row"
          className={`${
            handleClickRow && "cursor-pointer"
          } text-sm text-white leading-[21px] py-1 border-[0.2px] border-neutral-200 border-t-transparent z-50`}
        >
          {tableHeaders.map((header) => (
            <td
              key={`header-${header}-${datum.id}`}
              className="text-left py-[13px] px-[10px]"
            >
              <div className="flex gap-x-2">
                {handleClickRow ? (
                  <button
                    type="button"
                    data-testid="click-row"
                    className="text-left w-full"
                    onClick={() => {
                      if (handleClickRow) {
                        handleClickRow(datum);
                      }
                    }}
                  >
                    {datum[header]}
                  </button>
                ) : (
                  <span>{datum[header]}</span>
                )}
              </div>
            </td>
          ))}
        </tr>
      );
    });
  }

  const tableHeaderStyle = (index: number) =>
    index === tableHeaders.length - 1 ? "rounded-tr" : "";

  return (
    <div className="w-full relative font-figtree" data-testid="app-table">
      <div className="w-full overflow-x-scroll">
        <table className="w-full">
          <thead>
            <tr className=" py-1  rounded-t bg-neutral-100">
              {tableHeaders.map((header, index) => (
                <th
                  data-testid="table-header-data"
                  key={`header-${header}`}
                  className={`${
                    index === 0 ? "rounded-tl" : tableHeaderStyle(index)
                  } gap-x-2 text-sm text-neutral-800 leading-[21px] tracking-[0.14px] text-left py-[14.5px] pl-2.5 pr-[15px] font-bold`}
                >
                  <span className="flex items-center gap-x-2">{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={dropdownRef}>{tableBody}</tbody>
        </table>
      </div>

      {hasPagination &&
        handlePagination &&
        !loading &&
        tableData?.length > 0 && (
          <div className="pt-4 pb-0 w-full static">
            <Pagination
              totalItems={totalItems ?? 10}
              itemsPerPage={itemsPerPage ?? 10}
              onPageChange={handlePagination}
              currentPage={currentPage ?? 1}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
    </div>
  );
};
