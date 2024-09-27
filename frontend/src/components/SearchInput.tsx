"use client";

import { FC } from "react";
import { Icon } from "@iconify/react";

const SearchInput: FC<ISearchInput> = ({
  placeholder,
  handleSearch,
  value,
  deleteSearchValue,
  disabled,
}) => {
  return (
    <div
      className="relative w-full py-2 px-4 flex items-center gap-2 rounded-3xl border border-neutral-200"
      data-testid="search-input"
    >
      <Icon icon="ph:magnifying-glass" className="w-5 h-5 text-neutral-300" />
      <input
        placeholder={placeholder}
        onChange={handleSearch}
        value={value}
        className="border-none w-full text-[12px] leading-[19.2px] placeholder:text-[12px] placeholder:text-neutral-400 text-neutral-400 bg-transparent focus:outline-none"
        disabled={disabled || false}
      />
      <div className="absolute right-3 flex">
        {value && (
          <button
            type="button"
            className="cursor-pointer"
            onClick={deleteSearchValue}
          >
            <Icon icon="ph:x" className="w-4 h-4 text-neutral-200" />
            <span className="hidden">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
