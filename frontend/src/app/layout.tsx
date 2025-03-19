// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header/Header";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <Providers>
          <Toaster position="top-center" />
          <div className="relative min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
