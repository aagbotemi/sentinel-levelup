"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/utils/contract";

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
            <RainbowKitProvider
              // compactMode={true}
              theme={darkTheme({
                accentColor: "#0E76FD",
                accentColorForeground: "white",
                borderRadius: "large",
                fontStack: "system",
                overlayBlur: "small",
              })}
            >
              <NftProvider>{children}</NftProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
        ;
      </body>
    </html>
  );
};

export default CustomLayout;
