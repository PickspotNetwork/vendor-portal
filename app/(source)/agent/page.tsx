"use client";

import { useState } from "react";
import Link from "next/link";
import { Vendor } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { Notification } from "@/components/ui/notification";
import RedemptionForm from "@/components/redemption-form";
import RecentRedemptions from "@/components/recent-redemptions";
import VendorDetails from "@/components/admin/vendor-details";
import VendorsTable from "@/components/admin/vendors-table";
import { UserPlus, Sparkles } from "lucide-react";

export default function AgentsDashboard() {
  const { error, success, clearMessages } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"redemptions" | "vendors">(
    "redemptions",
  );
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("redemptions")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                  activeTab === "redemptions"
                    ? "border-b-2 border-red-800 text-red-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Redemptions
              </button>
              <button
                onClick={() => setActiveTab("vendors")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                  activeTab === "vendors"
                    ? "border-b-2 border-red-800 text-red-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Vendors
              </button>
            </nav>
          </div>

          {activeTab === "redemptions" && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Digital Handle Redemption
                  </h2>
                  <p className="text-gray-600">
                    Redeem Pickspot app users by entering their digital handle
                  </p>
                </div>
                <RedemptionForm />
              </div>

              <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RecentRedemptions />
              </div>
            </div>
          )}

          {activeTab === "vendors" && (
            <div className="p-6">
              {selectedVendor ? (
                <VendorDetails
                  vendor={selectedVendor}
                  onBack={handleBackToVendors}
                  userRole={user?.role}
                />
              ) : (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl bg-black lg:p-4 shadow-lg">
                    <div className="relative flex items-center justify-between">
                      <div className="hidden lg:flex items-start gap-4">
                        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                          <UserPlus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            Add New Vendor
                          </h3>
                          <p className="text-white/90 text-sm max-w-md">
                            Register a new vendor account and help expand the Pickspot network
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/settings"
                        className="group relative flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl w-full lg:w-auto justify-center lg:justify-start"
                      >
                        <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        <span>Create Vendor</span>
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      </Link>
                    </div>
                  </div>

                  <VendorsTable
                    onVendorSelect={handleVendorSelect}
                    userRole={user?.role}
                  />
                </div>
              )}
            </div>
          )}
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
    </>
  );
}
