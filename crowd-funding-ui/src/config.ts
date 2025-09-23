import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, anvil } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const alchemyRPCUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;

const config = getDefaultConfig({
  appName: "Ocean Faucet",
  projectId: projectId,
  chains: [sepolia, anvil],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [anvil.id]: http("http://localhost:8545/"),
    [sepolia.id]: http(alchemyRPCUrl),
  },
});

export default config;
