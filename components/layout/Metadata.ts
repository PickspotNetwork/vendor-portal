import type { Metadata, Viewport } from "next";

const description =
  "Access your Pickspot Vendor Dashboard to manage redemptions, redeem handles, and earn money for every digital handle redeemed.";
const url = "https://vendor.dropoff.co.ke";
const icon = "/icons/android-chrome-512x512.png";
const image = "/images/post.png";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "Pickspot Vendor Portal",
    template: "%s | Pickspot Vendor Portal",
  },
  description,
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
    "last mile delivery",
  ],
  authors: [{ name: "Pickspot Network", url }],
  creator: "Pickspot Network",
  publisher: "Pickspot Network",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url,
    title: "Pickspot Vendor Portal",
    description,
    siteName: "Pickspot Vendor Portal",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Pickspot Vendor Portal Dashboard",
      },
    ],
  },
  twitter: {
    card: image ? "summary_large_image" : "summary",
    title: "Pickspot Vendor Portal",
    description,
    creator: "@PickspotNetwork",
    images: [image],
  },
  icons: {
    icon,
    shortcut: icon,
    apple: "/icons/apple-touch-icon.png",
    other: [
      {
        rel: "image/png",
        url: "/images/icons/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "image/png",
        url: "/images/icons/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pickspot Vendor Portal",
  },
  formatDetection: {
    telephone: false,
  },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
