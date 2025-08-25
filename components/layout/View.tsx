import React from "react";
import { UserProvider } from "@/context/UserContext";
import Header from "../source/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function View({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans w-full min-h-screen text-black bg-gradient-to-br from-gray-50 to-gray-100 px-4 xs:px-6 lg:px-8 py-4`}
    >
      <UserProvider>
        <Header />
        <main className="max-w-7xl mx-auto w-full">{children}</main>
      </UserProvider>
    </div>
  );
}
