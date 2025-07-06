"use client";

import { Hepta_Slab } from "next/font/google";
import "./globals.css";
// import { IntMaxClientProvider } from "@/components/contexts/IntMaxClientContext";
import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { PrivyWrapper } from "@/components/providers/privy/PrivyWrapper";
import { WagmiWrapper } from "@/components/wagmi/WagmiProvider";

// import initSync from "@/components/hooks/init";

// // import { generate_intmax_account_from_eth_key } from '@/src/lib/intmax/wasm/intmax2_wasm_lib';
// import { useEffect } from "react";

const heptaSlab = Hepta_Slab({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // useEffect(() => {
  //   const run = async () => {
  //     const res = await fetch('public/wasm/intmax2_wasm_lib_bg');
  //     const bytes = await res.arrayBuffer();
  //     await initSync(bytes);
  //   };

  //   run();
  // }, []);

  return (
    <html lang="en">
      <body
        className={`${heptaSlab.variable} antialiased dark`}
      >
      {/* <IntMaxClientProvider> */}
        <WagmiWrapper>
          <PrivyWrapper>
            <Header />
            <CartSidebar />
                {children}
          </PrivyWrapper>
        </WagmiWrapper>
        {/* </IntMaxClientProvider> */}
      </body>
    </html>
  );
}
