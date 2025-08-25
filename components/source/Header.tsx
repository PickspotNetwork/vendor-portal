"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Loader2, User, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { authApi } from "@/lib/api";

export default function Header() {
  const { user, logout: userContextLogout } = useUser();
  const { isLoading } = useAuth();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error("API logout failed:", error);
    } finally {
      userContextLogout();
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="h-10 flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/images/wordmark.svg"
                alt="Pickspot Logo"
                width={120}
                height={40}
                className="h-8 w-auto lg:pl-4"
              />
            </Link>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-[#D62E1F] to-[#B8251A] rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <div className="flex gap-1">
              <span className="hidden sm:block text-sm font-medium">
                {user?.firstName}
              </span>
              <span className="hidden sm:block text-sm font-medium">
                {user?.lastName}
              </span>
            </div>

            <ChevronDown
              className={`h-4 w-4 transition-transform ${isAccountDropdownOpen ? "rotate-180" : ""}`}
            />
          </Button>

          {isAccountDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.phoneNumber}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoading || isLoggingOut}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {isLoading || isLoggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
