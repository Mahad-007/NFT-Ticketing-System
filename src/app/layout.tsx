import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3ProviderWrapper } from "@/context/Web3Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Ticketing System",
  description: "A decentralized NFT ticketing system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ProviderWrapper>{children}</Web3ProviderWrapper>
      </body>
    </html>
  );
}
