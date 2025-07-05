import type { Metadata } from "next";
import { Hepta_Slab } from "next/font/google";
import "./globals.css";
import { IntMaxClientProvider } from "@/components/contexts/IntMaxClientContext";
import { PrivyProvider } from '@privy-io/react-auth';
import { celo, sepolia } from 'viem/chains';



const heptaSlab = Hepta_Slab({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntCash - Pay with IntMax",
  description: "Pay with IntMax using IntCash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${heptaSlab.variable} antialiased`}
      >
        <PrivyProvider 
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "your-app-id"}
          clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? "your-client-id"}
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
          <IntMaxClientProvider>
            {children}
          </IntMaxClientProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
