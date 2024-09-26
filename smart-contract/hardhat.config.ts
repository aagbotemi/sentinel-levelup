import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

type HttpNetworkAccountsUserConfig = /*unresolved*/ any

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC,
      chainId: 534351,
      accounts: [process.env.DEPLOYER_ADDRESS] as HttpNetworkAccountsUserConfig | undefined,
    },
  },
  etherscan: {
    apiKey: process.env.SCROLL_API_KEY,
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: String(process.env.SCROLL_SEPOLIA_RPC),
        },
      },
    ],
  }
};

export default config;
