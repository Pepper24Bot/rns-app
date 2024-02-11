import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageWrapper from "@/components/Wrapper/PageWrapper";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Root Name Service",
  description: "Root Name Service",
};

export interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout(props: LayoutProps) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={inter.className}>
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
