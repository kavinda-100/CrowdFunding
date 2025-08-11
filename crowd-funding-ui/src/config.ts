import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { http } from "wagmi";
import {
  mainnet,
  zksync,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  anvil,
} from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Ocean Faucet",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, zksync, polygon, optimism, arbitrum, base, sepolia, anvil],
  ssr: true, // If your dApp uses server side rendering (SSR)
  // transports: {
  //   [anvil.id]: http("http://localhost:8545/rpc"),
  // },
});

export default config;
