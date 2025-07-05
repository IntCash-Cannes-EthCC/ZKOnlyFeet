"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { mainnet, celo, sepolia } from 'viem/chains';

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider 
        appId={process.env.NEXT_PUBLIC_PRIVY ?? ""}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? ""}
        config={{
            embeddedWallets: {
            ethereum: {
                createOnLogin: 'users-without-wallets',
            },
            },
            supportedChains: [mainnet, sepolia, celo],
        }}
        >
        {children}
        </PrivyProvider>
    );
}
