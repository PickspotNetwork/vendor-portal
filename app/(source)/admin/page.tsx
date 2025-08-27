"use client";

import { useState } from "react";
import { Vendor } from "@/lib/api";
import VendorsTable from "@/components/admin/vendors-table";
import VendorDetails from "@/components/admin/vendor-details";

export default function AdminDashboard() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleBackToVendors = () => {
    setSelectedVendor(null);
  };

  return (
    <div className="space-y-6">
      {selectedVendor ? (
        <VendorDetails vendor={selectedVendor} onBack={handleBackToVendors} />
      ) : (
        <VendorsTable onVendorSelect={handleVendorSelect} />
      )}
    </div>
  );
}
