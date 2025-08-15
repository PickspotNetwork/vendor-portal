import type { Metadata, Viewport } from "next";

const description =
  "Access your Pickspot vendor dashboard to manage deliveries, track orders, and grow your business with smart locker solutions across Africa.";
const url = "https://vendor.pickspot.world";
const icon = "/icons/android-chrome-512x512.png";
const image = "/images/post.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://vendor.pickspot.world"),
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
    url: "https://vendor.pickspot.world",
    title: "Pickspot Vendor Portal",
    description:
      "Manage your deliveries and grow your business with Pickspot's smart locker network across Africa.",
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
    description:
      "Manage your deliveries and grow your business with Pickspot's smart locker network.",
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
    title: "Pickspot Vendor",
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
