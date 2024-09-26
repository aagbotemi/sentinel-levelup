// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const URI = "http://";

const SentinelNFTModule = buildModule("SentinelNFTModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", URI);

  const sentinel = m.contract("SentinelNFT", [baseTokenURI]);

  return { sentinel };
});

export default SentinelNFTModule;
