"use client";

import { Icon } from "@iconify/react";

export const EmptyData = ({ title, subTitle }: IEmptyData) => (
  <span
    data-testid="empty-data"
    className="w-[90vw] lg:w-full text-center h-full flex items-center justify-center py-5"
  >
    <span className="w-[80%] lg:w-3/12 flex flex-col justify-center items-center">
      <span className="my-4">
        <Icon
          icon="iconoir:database-xmark-solid"
          className="h-20 w-20 text-neutral-200"
        />
      </span>
      <p className="font-semibold text-neutral-200">{title}</p>
      <p className="text-label text-md">{subTitle}</p>
    </span>
  </span>
);
