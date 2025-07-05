"use client";

import { Hepta_Slab } from "next/font/google";
import "./globals.css";
// import { IntMaxClientProvider } from "@/components/contexts/IntMaxClientContext";
import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { PrivyWrapper } from "@/components/providers/privy/PrivyWrapper";

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
    <html lang="en">
      <body
        className={`${heptaSlab.variable} antialiased dark`}
      >
        <PrivyWrapper>
          <Header />
          <CartSidebar />
            {/* <IntMaxClientProvider> */}
              {children}
            {/* </IntMaxClientProvider> */}
        </PrivyWrapper>
      </body>
    </html>
  );
}
