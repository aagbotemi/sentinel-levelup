"use client";
import { FC } from "react";
import { Icon } from "@iconify/react";

export const Pagination: FC<IPagination> = ({
  totalItems,
  itemsPerPage,
  setItemsPerPage,
  onPageChange,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = currentPage - halfMaxVisiblePages;
    let endPage = currentPage + halfMaxVisiblePages;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button type="button" key={1} onClick={() => handleClick(1)}>
          1
        </button>,
        <span key="ellipsis-start">...</span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          type="button"
          key={i}
          onClick={() => handleClick(i)}
          className={
            i === currentPage
              ? "text-neutral-100 font-semibold cursor-default"
              : "cursor-pointer"
          }
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <span key="ellipsis-end">...</span>,
        <button
          type="button"
          key={totalPages}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const pageTo = () => {
    if (totalItems < itemsPerPage) {
      return totalItems;
    } else if (totalItems === itemsPerPage) {
      return itemsPerPage;
    } else if (totalItems <= itemsPerPage * currentPage) {
      return totalItems;
    } else {
      return itemsPerPage * currentPage;
    }
  };

  const getPageNumberOfTotal = () => {
    const from =
      totalItems <= itemsPerPage ? "1" : itemsPerPage * (currentPage - 1) + 1;
    const to = pageTo();
    return { from, to };
  };

  return (
    <div className="w-full flex justify-between items-center z-50">
      <p className="text-sm text-neutral-300 leading-[21px] font-normal hidden lg:block">
        Showing{" "}
        {`${getPageNumberOfTotal()?.from} - ${getPageNumberOfTotal()?.to}`} of{" "}
        {totalItems}
      </p>
      <div className="flex items-center gap-4  text-sm text-neutral-400 leading-[21px] font-normal">
        <button
          onClick={() => handleClick(currentPage - 1)}
          data-testid="prev"
          type="button"
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "cursor-not-allowed"
              : "cursor-pointer text-neutral-100"
          }  flex items-center gap-1`}
        >
          <Icon icon="ph:caret-circle-left" className="w-6 h-6" />
          <span className="hidden">x</span>
        </button>
        {renderPagination()}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => handleClick(currentPage + 1)}
          className={`${
            currentPage === totalPages
              ? "cursor-not-allowed"
              : "cursor-pointer text-neutral-400"
          } flex items-center gap-1`}
          data-testid="next"
        >
          <span className="hidden"> Next</span>{" "}
          <Icon icon="ph:caret-circle-right" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex border border-neutral-300 rounded-md">
        <select
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
          className="border-none  text-center p-1 w-fit text-md leading-[19.2px] text-neutral-300 bg-transparent focus:outline-none"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};
