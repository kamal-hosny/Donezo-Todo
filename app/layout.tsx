import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import Nav from "@/components/Nav";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donezo",
  description: "Organize your life with us",
  icons: "https://i.pinimg.com/736x/8f/1a/d2/8f1ad259575400cc1ebe92a7f6771040.jpg"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
