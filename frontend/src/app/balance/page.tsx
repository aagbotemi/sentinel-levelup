"use client";

import Navbar from "@/components/Navbar";
import NetworkDropdown from "@/components/NetworkDropdown";
import axios from "axios";
import React, { useState } from "react";

const Balance = () => {
  const [activeTab, setActiveTab] = useState("erc20");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [result, setResult] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedNetwork(value);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeTab === "erc20") {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/get-erc20-balance/${selectedNetwork}/${contractAddress}/${userAddress}`
        );
        setSelectedNetwork("");
        setContractAddress("");
        setUserAddress("");
        setResult(data);
      } else if (activeTab === "native") {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/get-native-balance/${selectedNetwork}/${userAddress}`
        );
        setSelectedNetwork("");
        setUserAddress("");
        setResult(data);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#0c0c0c] w-screen h-screen overflow-y-auto p-3 md:p-5 mx-auto">
      <div className=" mx-auto bg-transparent w-full h-full rounded-[16px] relative overflow-hidden border-[5px] border-[#A270FF] border-opacity-[30%]  lg:p-[40px] p-[20px] drop-shadow-xl">
        <div className="w-[1008px] h-[656px] bg-[#A270FF] opacity-[95%] rounded-full -rotate-[22.34deg] blur-[332.36px] absolute left-[300.13px] top-[250.42px] z-10"></div>
        <div className="mb-16">
          <Navbar />
        </div>

        <div className="bg-white inline px-1 py-3 rounded-md">
          <button
            className={`${
              activeTab == "erc20" ? "bg-[#A270FF]" : null
            } p-2 rounded-md font-semibold`}
            onClick={() => setActiveTab("erc20")}
          >
            ERC20 Balance
          </button>
          <button
            className={`${
              activeTab == "native" ? "bg-[#A270FF]" : null
            } p-2 rounded-md font-semibold`}
            onClick={() => setActiveTab("native")}
          >
            Native Balance
          </button>
        </div>

        <div className="mt-24">
          <div className="flex">
            <div className="text-white text-[20px] font-semibold mr-2">
              Select Chain:
            </div>
            <NetworkDropdown
              selectedNetwork={selectedNetwork}
              handleChange={handleChange}
            />
          </div>
          {activeTab === "erc20" && (
            <div className="mt-4 flex">
              <div className="text-white text-[20px] font-semibold mr-2">
                Contract Address:
              </div>
              <input
                type="text"
                name="contractAddress"
                value={contractAddress}
                placeholder="0x..."
                onChange={(e: any) => setContractAddress(e.target.value)}
              />
            </div>
          )}
          <div className="my-4 flex">
            <div className="text-white text-[20px] font-semibold mr-2">
              User Address:
            </div>
            <input
              type="text"
              name="userAddress"
              value={userAddress}
              placeholder="0x..."
              onChange={(e: any) => setUserAddress(e.target.value)}
            />
          </div>

          <button
            className={`bg-[#A270FF] p-2 rounded-md`}
            onClick={handleSubmit}
          >
            {loading ? "Loading Balance..." : "Check Balance"}
          </button>
        </div>

        {result != "" && (
          <div className="text-white mt-10 text-[18px] font-medium">
            The Balance is: {result} <sub>*with decimal</sub>
          </div>
        )}
      </div>
    </main>
  );
};

export default Balance;
