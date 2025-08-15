import View from "@/components/layout/View";
import "@/styles/globals.css";

export * from "@/components/layout/Metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <View>{children}</View>;
}
