import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { DateDisplay } from "@/components/ui/date-display";
import { TitleDisplay } from "@/components/ui/title-display";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PageTransitionProvider } from "@/components/page-transition";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edevery.com";

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
  metadataBase: new URL(siteUrl),
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
  alternates: {
    canonical: "/",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              mainEntity: {
                "@type": "Person",
                name: "Emily Devery",
                jobTitle: "Designer & Art Director",
                url: siteUrl,
                sameAs: [
                  "https://x.com/emdevvv",
                  "https://www.linkedin.com/in/emily-devery/",
                  "https://www.instagram.com/edevery/",
                ],
              },
            }),
          }}
        />
        <div className="fixed top-0 left-0 right-0 h-[58px] bg-gradient-to-b from-black from-[48px] to-transparent z-40 pointer-events-none" />
        <span className="fixed top-6 left-6 text-xs font-medium font-[family-name:var(--font-inter)] z-50">
          <AnimatedShinyText className="text-white/60">Made in NYC</AnimatedShinyText>
        </span>
        <TitleDisplay />
        <DateDisplay />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
        <Navbar />
        <CustomCursor />
      </body>
    </html>
  );
}
