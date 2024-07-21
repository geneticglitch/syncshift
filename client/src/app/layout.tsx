import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncShift",
  description: "Productivity Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${inter.className} dark`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}