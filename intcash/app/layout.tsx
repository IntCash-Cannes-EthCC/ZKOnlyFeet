"use client";

import { Hepta_Slab } from "next/font/google";
import "./globals.css";
// import { IntMaxClientProvider } from "@/components/contexts/IntMaxClientContext";
import { Header } from "@/components/Header";
import { CartSidebar } from "@/components/cart/CartOpened";
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
    <html lang="en" className="dark">
      <PrivyWrapper>
      <body
        className={`${heptaSlab.variable} antialiased`}
      >
        <Header />
        <CartSidebar />
          {/* <IntMaxClientProvider> */}
            {children}
          {/* </IntMaxClientProvider> */}
      </body>
      </PrivyWrapper>
    </html>
  );
}
