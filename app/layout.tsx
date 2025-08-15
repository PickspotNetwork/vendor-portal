import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";

export * from "@/components/layout/Metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
