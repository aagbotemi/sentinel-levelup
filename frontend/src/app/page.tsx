"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNftContext } from "@/hooks";

export default function Home() {
  const { hasNft } = useNftContext();
  const [isHover, setIsHover] = useState<boolean>(false);

  const [result, setResult] = useState("");

  useEffect(() => {
    const handleTransactionCount = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/transactions`
        );
        setResult(data.length);
        console.log({ data });
      } catch (error: any) {
        console.log(error.message);
      }
    };

    handleTransactionCount();
  }, []);
  return (
    <main className="bg-[#0c0c0c] w-screen h-screen overflow-y-auto p-3 md:p-5 mx-auto">
      <div className=" mx-auto bg-transparent  rounded-[16px] relative overflow-hidden border-[5px] border-[#A270FF] border-opacity-[30%]  lg:p-[40px] p-[20px] drop-shadow-xl">
        <div className="w-[1008px] h-[656px] bg-[#A270FF] opacity-[95%] rounded-full -rotate-[22.34deg] blur-[332.36px] absolute left-[300.13px] top-[250.42px] z-10"></div>

        <Image
          src="/pattern.svg"
          width={0}
          height={0}
          alt=""
          className="absolute top-0 w-auto h-auto z-0"
        />
        {/** NAVBAR SECTION */}
        <Navbar />

        {/** HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-12 text-white">
          <div className="">
            <div className="text-[60px] leading-[1.2]">
              <div className="">Real-Time</div>
              <div className="flex items-center lg:ml-12">Transaction</div>
              <div className="lg:ml-56 ">Insights</div>
            </div>

            <div className="mt-8 relative">
              <Link
                onMouseOver={() => setIsHover(true)}
                onMouseOut={() => setIsHover(false)}
                onFocus={() => setIsHover(true)}
                onBlur={() => setIsHover(false)}
                className={`bg-black py-4 px-6 lg:w-[64%] lg:flex lg:justify-center rounded-xl lg:rounded-lg ${
                  !hasNft && "cursor-not-allowed"
                }`}
                href={hasNft ? "/transactions/pending" : "#"}
              >
                Explore Transactions
              </Link>

              {isHover && !hasNft && (
                <span className="absolute -top-14 left-0 bg-neutral-100 text-neutral-800 rounded-lg p-3 text-sm w-max font-medium z-50">
                  Unauthorized! NFT is required for access.
                </span>
              )}
            </div>
          </div>
          <div className="mt-12 text-white">
            <div className="mb-2 text-[24px] leading-[1.3]">
              Monitor, analyze, and query blockchain <br /> transactions with
              ease
            </div>
            <div className="text-[18px] font-bold">
              <div className="flex items-center">
                <Icon
                  icon="ph:dot-outline-duotone"
                  className="text-[#B18FEE] w-10 h-10"
                />
                Live Mempool Scanning
              </div>
              <div className="flex items-center">
                <Icon
                  icon="ph:dot-outline-duotone"
                  className="text-[#B18FEE] w-10 h-10"
                />
                Advanced Transaction Filtering
              </div>
              <div className="flex items-center">
                <Icon
                  icon="ph:dot-outline-duotone"
                  className="text-[#B18FEE] w-10 h-10"
                />
                GraphQL API for Flexible Queries
              </div>
              <div className="flex items-center">
                <Icon
                  icon="ph:dot-outline-duotone"
                  className="text-[#B18FEE] w-10 h-10"
                />
                Historical Transaction Analysis
              </div>
            </div>
          </div>
        </div>

        {/** STATS SECTION */}
        <div className="mt-16 z-20">
          <div className="text-center text-white mb-8 text-[32px] leading-[1.3]">
            Trusted by leading DeFi protocols and blockchain researchers
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[85%] md:w-[65%] mx-auto text-center md:text-left">
            <div className="col-span-1 bg-black bg-opacity-[45%] z-30 border-2 border-[#B18FEE] shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px]  text-white px-6 py-4 flex justify-center items-center flex-col rounded-3xl">
              <div className="text-[40px] font-bold">{result}</div>
              <div className="text-[24px] font-medium">
                Transactions Processed
              </div>
            </div>
            <div className="grid col-span-1 text-[24px] gap-y-4 font-medium">
              <div className="bg-black border-2 border-[#B18FEE] rounded-3xl shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px]">
                <div className=" bg-black z-30 text-white px-6 py-12 mb-4 leading-7 flex justify-center items-center flex-col rounded-3xl">
                  <div className="">Faster than traditional</div>
                  <div className="">blockchain explorers</div>
                </div>
              </div>

              <div className="bg-black border-2 border-[#B18FEE] rounded-3xl shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px]">
                <div className=" bg-black z-30  text-white px-6 py-12  flex justify-center items-center flex-col leading-7 rounded-3xl">
                  <div className="">Used by top</div>
                  <div className="">blockchain projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
