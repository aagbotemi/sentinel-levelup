import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia, scroll, scrollSepolia } from "@reown/appkit/networks";

const projectId: string = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID ?? "";

const networks: any[] = [scroll, scrollSepolia, sepolia];

const metadata = {
  name: "Sentinel Levelup",
  description: "Sentinel Levelup",
  url: "https://sentinel-levelup.com",
  icons: ["https://sentinel-levelup.com/logo.png"],
};

export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: scrollSepolia,
  enableEIP6963: true,

  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: [],
  },
});
