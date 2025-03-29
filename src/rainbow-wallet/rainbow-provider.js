"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { baseSepolia } from "viem/chains";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Hackathon",
  autoConnect: true,
  projectId: "be36d80bd82aef7bdb958bb467c3e570",
  chains: [baseSepolia],
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
