"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { SENTINEL_NFT_ADDRESS, client } from "@/utils/contract";
import { SENTINEL_NFT_ABI } from "@/utils/nft";
import { NftContext } from "./NFTContext";

export const NftProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();

  const [hasNft, setHasNFT] = useState<boolean>(false);

  const checkNftOwnership = async () => {
    if (!address) return;

    const balance = (await client.readContract({
      address: SENTINEL_NFT_ADDRESS,
      abi: SENTINEL_NFT_ABI,
      functionName: "balanceOf",
      args: [address],
    })) as number;

    const balanceAsNumber = Number(balance);
    setHasNFT(balanceAsNumber > 0);
  };

  useEffect(() => {
    if (address) {
      checkNftOwnership();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <NftContext.Provider value={{ hasNft, checkNftOwnership }}>
      {children}
    </NftContext.Provider>
  );
};
