import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { DateDisplay } from "@/components/ui/date-display";
import { TitleDisplay } from "@/components/ui/title-display";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "edevery.",
  description: "Emily Devery - Designer & Art Director",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <span className="fixed top-6 left-6 text-xs font-medium font-[family-name:var(--font-inter)] z-50">
          <AnimatedShinyText className="text-white/60">Made in NYC</AnimatedShinyText>
        </span>
        <TitleDisplay />
        <DateDisplay />
        {children}
        <Navbar />
      </body>
    </html>
  );
}
