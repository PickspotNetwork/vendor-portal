"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/api";
import { Loader2, User, Eye, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";

interface VendorsTableProps {
  onVendorSelect: (vendor: Vendor) => void;
}

export default function VendorsTable({ onVendorSelect }: VendorsTableProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    setIsLoading(true);
    setError("");

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found");
      setIsLoading(false);
      return;
    }

    const fetchVendor = async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-vendors`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 401) return null;

        if (!response.ok) {
          setError("Error fetching vendors");
          return null;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch vendors";
        setError(errorMessage);
        return null;
      }
    };

    try {
      let data = await fetchVendor(accessToken);

      if (!data) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          data = await fetchVendor(newAccessToken);
        } else {
          setError("Session expired");
          setIsLoading(false);
          return;
        }
      }

      if (data && data.data) {
        setVendors(data.data);
      } else {
        setError("Failed to fetch vendors data");
        setVendors([]);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalUnpaidAmount = vendors.reduce(
    (sum, vendor) => sum + vendor.unpaidRedeemedUsersCount * 50,
    0
  );
  const sortedVendors = [...vendors].sort(
    (a, b) => b.unpaidRedeemedUsersCount - a.unpaidRedeemedUsersCount
  );

  useEffect(() => {
    fetchVendors();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to load vendors</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button onClick={fetchVendors} variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-1" />
          Try again
        </Button>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No vendors found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="hidden lg:flex items-center justify-between mb-2">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              All Vendors
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor vendor accounts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Outstanding
              </div>
              <div className="text-sm font-bold text-[#d62e1f]">
                KSh {totalUnpaidAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">Last updated</div>
            <div className="text-sm font-medium text-gray-700">Just now</div>
          </div>
          <Button
            onClick={fetchVendors}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
          >
            <RefreshCw className="h-4 w-4 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
          </Button>
        </div>
      </div>
      <div className="lg:hidden space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              All Vendors
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor vendor accounts
            </p>
          </div>
          <Button
            onClick={fetchVendors}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
          >
            <RefreshCw className="h-4 w-4 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <TrendingUp className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Outstanding
              </div>
              <div className="text-sm font-bold text-[#d62e1f]">
                KSh {totalUnpaidAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-[70vh] lg:h-[80vh]">
        <div className="overflow-y-auto h-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Unpaid
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedVendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className={`hover:bg-gradient-to-r cursor-pointer transition-all duration-300 border-b border-gray-100 hover:shadow-sm ${
                    vendor.suspended
                      ? "hover:from-red-50 hover:to-pink-50 hover:border-red-200 bg-red-50/90"
                      : "hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200"
                  }`}
                  onClick={() => onVendorSelect(vendor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="">
                        <p
                          className={`text-sm font-medium capitalize ${
                            vendor.suspended ? "text-red-900" : "text-gray-900"
                          }`}
                        >
                          {vendor.firstName} {vendor.lastName}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {vendor._id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.unpaidRedeemedUsersCount > 0 ? (
                      <span className="inline-flex items-center justify-center px-3 font-medium rounded-[5px] bg-[#fff9f9] text-[#d62e1f] border-[1px] border-[#d62e1f]">
                        {vendor.unpaidRedeemedUsersCount}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.suspended ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-sans text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                        {vendor.phoneNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(vendor.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(vendor.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-full hover:text-[#d62e1f] hover:bg-white transition-all duration-200 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVendorSelect(vendor);
                      }}
                    >
                      <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
