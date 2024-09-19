import { Inter as FontSans} from "next/font/google"
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
  import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "The paragraph",
  description: "Real time Blogging platform with rich text editing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="manifest" href="/site.webmanifest" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="min-h-screen flex flex-col items-center">
          
          {children}

        </main>
      </body>
    </html>
  );
}
