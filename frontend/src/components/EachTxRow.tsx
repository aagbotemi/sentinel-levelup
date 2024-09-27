"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import copy from "copy-to-clipboard";

const EachTxRow = ({ label, value, info, isLink, isCopy, unit }: ITrxRow) => {
  const [isHover, setIsHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-x-2 w-full">
        <div className="flex items-center gap-1 md:border-r w-[200px] md:pe-3">
          <span className="flex items-center gap-x-1 text-[#0c0c0c]">
            {label} <span className="text-md text-neutral-400">{unit}</span>
          </span>
          {info && (
            <button
              type="button"
              className=""
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              onFocus={() => setIsHover(true)}
              onBlur={() => setIsHover(false)}
            >
              <Icon icon="ph:info-duotone" className="text-neutral-700" />
            </button>
          )}
          {isCopy && (
            <button type="button" onClick={handleCopy} className="md:hidden">
              <Icon
                icon={`ph:${copied ? "check" : "copy-duotone"}`}
                className="text-neutral-700 cursor-pointer"
              />
            </button>
          )}
        </div>
        {isLink ? (
          <Link
            href={`${isLink}/${value}`}
            target="_blank"
            className="text-blue-800 md:pl-3 text-sm md:text-base"
          >
            {value}
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-neutral-500 text-sm md:text-base font-medium md:pl-3 w-max">
            {value}
            {isCopy && (
              <button
                type="button"
                onClick={handleCopy}
                className="hidden md:block"
              >
                <Icon
                  icon={`ph:${copied ? "check" : "copy-duotone"}`}
                  className="text-neutral-700 cursor-pointer"
                />
              </button>
            )}
          </span>
        )}
      </div>
      {isHover && (
        <span className="absolute -top-[180%] left-3 bg-neutral-100 rounded-lg p-3 text-sm w-max font-medium">
          {info}
        </span>
      )}
    </div>
  );
};

export default EachTxRow;
