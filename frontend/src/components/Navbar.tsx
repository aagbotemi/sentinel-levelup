"use client";

import React, { useEffect, useState, useMemo } from "react";
import { navItems } from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";
import ConnectionButton from "./ConnectionButton";
import { useAccount, useConnect } from "wagmi";
import { scrollSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";
import { SENTINEL_NFT_ADDRESS, client } from "@/utils/contract";
import { SENTINEL_NFT_ABI } from "@/utils/nft";

const Navbar = () => {
  const pending = "/transactions/pending";
  const completed = "/transactions/completed";
  const homeRoute = "/";

  const openRoutes = useMemo(() => [completed, homeRoute], []);

  const pathname = usePathname();
  const route = useRouter();
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const [hasNft, setHasNFT] = useState<boolean>(false);

  useEffect(() => {
    if (!hasNft && !openRoutes.includes(pathname)) {
      route.push(homeRoute);
    }
  }, [hasNft, openRoutes, pathname, route]);

  useEffect(() => {
    (async () => {
      if (!address) {
        await connectAsync({
          chainId: scrollSepolia.id,
          connector: injected(),
        });
      }

      if (address) {
        const balance = (await client.readContract({
          address: SENTINEL_NFT_ADDRESS,
          abi: SENTINEL_NFT_ABI,
          functionName: "balanceOf",
          args: [address],
        })) as number;

        setHasNFT(balance > 0 ? true : false);
      }
    })();
  }, [address, connectAsync]);

  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigate = (path: string) => {
    if (!hasNft && !openRoutes.includes(path)) {
      return;
    }
    route.push(path);
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex text-3xl font-black">
        <div className="text-[#B18FEE]">Sen</div>
        <div className="text-white">tinel</div>
      </div>

      <div className="flex gap-x-6">
        {navItems.map((navItem) => {
          const active = pathname.split("/")[1] === navItem.href.split("/")[1];
          const protectedPath = !hasNft && navItem.href != "/";

          if (navItem.name === "Transactions") {
            return (
              <div key={navItem.href} className="relative">
                {(!active || !isMobile) && (
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className={`text-white font-bold text-md leading-[21px] ${
                      active ? "opacity-1" : "opacity-60"
                    }`}
                  >
                    {navItem.name}
                  </button>
                )}
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-gray-800 z-50 rounded shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleNavigate(completed)}
                    >
                      <div className="px-4 py-2 text-white hover:bg-gray-700">
                        Completed
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate(pending)}
                    >
                      <div
                        className={`px-4 py-2 text-white hover:bg-gray-700 ${
                          protectedPath && "cursor-not-allowed"
                        }`}
                      >
                        Pending
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            (!active || !isMobile) && (
              <div>
                <button
                  type="button"
                  onClick={() => handleNavigate(navItem.href)}
                  key={navItem.name}
                  className={`text-white font-bold text-md leading-[21px] ${
                    protectedPath && "cursor-not-allowed"
                  } ${active ? "opacity-1" : "opacity-60"}`}
                >
                  {navItem.name}
                </button>
              </div>
            )
          );
        })}
      </div>

      <ConnectionButton />
    </div>
  );
};

export default Navbar;
