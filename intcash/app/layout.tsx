"use client";

import { Hepta_Slab } from "next/font/google";
import "./globals.css";
// import { IntMaxClientProvider } from "@/components/contexts/IntMaxClientContext";
import { PrivyProvider } from '@privy-io/react-auth';
import { celo, sepolia } from 'viem/chains';
import { Header } from "@/components/Header";

const heptaSlab = Hepta_Slab({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <PrivyProvider 
          appId={process.env.NEXT_PUBLIC_PRIVY ?? ""}
          clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? ""}
          config={{
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              ethereum: {
                createOnLogin: 'users-without-wallets'
              }
            },
            supportedChains: [sepolia, celo]
          }}
        >
      <body
        className={`${heptaSlab.variable} antialiased`}
      >
        <Header />
          {/* <IntMaxClientProvider> */}
            {children}
          {/* </IntMaxClientProvider> */}
      </body>
      </PrivyProvider>
    </html>
  );
}
