// import {getSession } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider"
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Metadata } from 'next';
import { template } from "cypress/types/lodash";
 



export const metadata: Metadata = {
  // metadataBase: new URL(defaultUrl),
  title:{
    template: '%s | the-paragraph',
    default: 'the-paragraph'
  },
  description: "Real-time Blogging platform with rich text editing",
  metadataBase: new URL('https://www.the-paragraph.com/'),
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        {/* Add other head elements here if needed */}
      </head>
      <body
        className={cn(
          "min-w-[100%] bg-background font-sans antialiased w-[100%]",
          fontSans.variable
        )}
      >

        <main className="min-h-screen flex flex-col items-center justify-center w-[100%]">
        <Providers>

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
          </ThemeProvider>
            </Providers>
        </main>
      </body>
    </html>
  );
}
