"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/utils/contract";
import "../connection.ts";

import "@rainbow-me/rainbowkit/styles.css";
import { NftProvider } from "@/contexts/NFTProvider";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <html lang="en">
      <body className={"font-figTree"}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <NftProvider>{children}</NftProvider>
          </QueryClientProvider>
        </WagmiProvider>
        ;
      </body>
    </html>
  );
};

export default CustomLayout;
