import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "edevery.",
  description: "Emily Devery - Designer & Art Director",
  openGraph: {
    title: "edevery.",
    description: "Emily Devery - Designer & Art Director",
    siteName: "edevery.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@emdevvv",
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
        {children}
      </body>
    </html>
  );
}
