"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/components/ui/notification";
import { useUser } from "@/context/UserContext";
import { Settings, User, ArrowLeft, Home } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-2">
        <Link
          href={user?.role === "admin" ? "/admin" : "/dashboard"}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#D62E1F] hover:bg-gray-50 rounded-lg transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <Home className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D62E1F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-[#D62E1F]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-[#D62E1F]" />
              Profile Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    value={user?.firstName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    value={user?.lastName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </Label>
                <Input
                  value={user?.phoneNumber || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </Label>
                <Input
                  value={user?.role || ""}
                  disabled
                  className="bg-gray-50 capitalize"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Notification type="error" message={error} onClose={clearMessages} />
      )}
      {success && (
        <Notification
          type="success"
          message={success}
          onClose={clearMessages}
        />
      )}
    </div>
  );
}
