"use client";

import { useState } from "react";
import { Vendor } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { Notification } from "@/components/ui/notification";
import RedemptionForm from "@/components/redemption-form";
import RecentRedemptions from "@/components/recent-redemptions";
import VendorDetails from "@/components/admin/vendor-details";
import VendorsTable from "@/components/admin/vendors-table";

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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("redemptions")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                  activeTab === "redemptions"
                    ? "border-b-2 border-[#d62e1f] text-[#d62e1f]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Redemptions
              </button>
              <button
                onClick={() => setActiveTab("vendors")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
                  activeTab === "vendors"
                    ? "border-b-2 border-[#d62e1f] text-[#d62e1f]"
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
                <VendorsTable
                  onVendorSelect={handleVendorSelect}
                  userRole={user?.role}
                  userType="vendor"
                />
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
