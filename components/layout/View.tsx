import React from "react";
import { UserProvider } from "@/context/UserContext";
import Header from "../source/Header";

export default function View({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-4">
      <UserProvider>
        <Header />
        <main className="max-w-7xl mx-auto w-full">{children}</main>
      </UserProvider>
    </div>
  );
}
