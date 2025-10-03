"use client";

import { useState } from "react";
import { Vendor } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import VendorsTable from "@/components/admin/vendors-table";
import VendorDetails from "@/components/admin/vendor-details";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user } = useUser();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeTab, setActiveTab] = useState<"vendors" | "agents">("vendors");

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
  };

  return (
    <div className="space-y-6">
      {selectedVendor ? (
        <VendorDetails
          vendor={selectedVendor}
          onBack={handleBackToVendors}
          userRole={user?.role}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "vendors" ? "default" : "ghost"}
              onClick={() => setActiveTab("vendors")}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === "vendors"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Vendors
            </Button>
            <Button
              variant={activeTab === "agents" ? "default" : "ghost"}
              onClick={() => setActiveTab("agents")}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === "agents"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Agents
            </Button>
          </div>

          <VendorsTable
            onVendorSelect={handleVendorSelect}
            userRole={user?.role}
            userType={activeTab === "vendors" ? "vendor" : "agent"}
          />
        </div>
      )}
    </div>
  );
}
