"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/api";
import { Loader2, User, Eye, RefreshCw } from "lucide-react";
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
          },
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
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Vendors</h2>
        <Button onClick={fetchVendors} variant="ghost" size="sm" className="h-8 w-8 p-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onVendorSelect(vendor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {vendor.firstName} {vendor.lastName}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{vendor._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {vendor.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(vendor.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVendorSelect(vendor);
                      }}
                    >
                      <Eye className="h-4 w-4" />
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
