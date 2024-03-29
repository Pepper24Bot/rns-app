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

/**
 * To add new components in the body section,
 * go to (pages)/page.tsx
 *
 * @param props
 * @returns
 */

export default function RootLayout(props: LayoutProps) {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
