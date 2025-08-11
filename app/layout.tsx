import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { HeaderNav } from "@/components/header-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vendor.pickspot.world'),
  title: {
    default: "Pickspot Vendor Portal",
    template: "%s | Pickspot Vendor Portal"
  },
  description: "Access your Pickspot vendor dashboard to manage deliveries, track orders, and grow your business with smart locker solutions across Africa.",
  keywords: [
    "Pickspot",
    "vendor portal",
    "smart lockers",
    "delivery management",
    "logistics",
    "e-commerce",
    "Africa",
    "Kenya",
    "vendor dashboard",
    "package delivery",
    "last mile delivery"
  ],
  authors: [{ name: "Pickspot Network" }],
  creator: "Pickspot Network",
  publisher: "Pickspot Network",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vendor.pickspot.world",
    title: "Pickspot Vendor Portal",
    description: "Manage your deliveries and grow your business with Pickspot's smart locker network across Africa.",
    siteName: "Pickspot Vendor Portal",
    images: [
      {
        url: "/images/app.png",
        width: 1200,
        height: 630,
        alt: "Pickspot Vendor Portal Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickspot Vendor Portal",
    description: "Manage your deliveries and grow your business with Pickspot's smart locker network.",
    creator: "@PickspotNetwork",
    images: ["/images/app.png"]
  },

  manifest: "/icons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000"
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pickspot Vendor"
  },
  formatDetection: {
    telephone: false
  },
  category: "business"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderNav />
        {children}
      </body>
    </html>
  );
}
