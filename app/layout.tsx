import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { PageTransitionProvider } from "@/components/page-transition";
import { SiteChrome } from "@/components/layout/site-chrome";

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

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "edevery.",
  description: "Emily Devery — Designer",
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
    description: "Emily Devery — Designer",
    siteName: "edevery.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/Assets/OGTag.png`,
        width: 1200,
        height: 630,
        alt: "edevery. — Emily Devery, Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@emdevvv",
    images: [`${siteUrl}/Assets/OGTag.png`],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${instrumentSans.variable} antialiased`}
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
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
        <SiteChrome />
      </body>
    </html>
  );
}
