"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  baseSepolia,
  mantleSepoliaTestnet,
  monadTestnet,
  optimismSepolia,
} from "viem/chains";
import { defineChain } from "viem";

const queryClient = new QueryClient();

const disburseNetwork = defineChain({
  id: 28082002,
  name: "Disburse Network",
  nativeCurrency: {
    name: "Disburse Token",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["http://35.94.203.84:8549"] },
    public: { http: ["http://35.94.203.84:8549"] },
  },
});

const config = getDefaultConfig({
  appName: "Hackathon",
  autoConnect: true,
  projectId: "be36d80bd82aef7bdb958bb467c3e570",
  chains: [
    disburseNetwork,
    baseSepolia,
    optimismSepolia,
    mantleSepoliaTestnet,
    monadTestnet,
  ],
  ssr: true,
});

export const RainbowKitWrapper = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
