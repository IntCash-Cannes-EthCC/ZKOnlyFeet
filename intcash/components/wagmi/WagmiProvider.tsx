"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import {
    mainnet,
    sepolia,
    celo,
} from "viem/chains";

export const config = createConfig({
    chains: [
        mainnet,
        sepolia,
        celo
    ],
    multiInjectedProviderDiscovery: false,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [celo.id]: http(),
    },
});

const queryClient = new QueryClient();


export const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
            {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default WagmiWrapper;