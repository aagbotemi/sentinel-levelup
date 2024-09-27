"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default CustomLayout;
