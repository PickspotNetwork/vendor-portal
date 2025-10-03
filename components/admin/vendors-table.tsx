/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/api";
import {
  Loader2,
  User,
  Eye,
  RefreshCw,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";
import Link from "next/link";

interface VendorsTableProps {
  onVendorSelect: (vendor: Vendor) => void;
  userRole?: string;
  userType?: "vendor" | "agent";
}

export default function VendorsTable({
  onVendorSelect,
  userRole,
  userType = "vendor",
}: VendorsTableProps) {
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
        const endpoint =
          userRole === "agent"
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-vendors-per-agent`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-vendors`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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
        // Filter users by role based on userType
        const filteredUsers = data.data.filter(
          (user: Vendor) => user.role === userType
        );
        setVendors(filteredUsers);
      } else {
        setError("Failed to fetch users data");
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

  const totalAmountOwed = vendors
    .filter((vendor) => !vendor.suspended)
    .reduce((sum, vendor) => sum + (vendor.totalAmountOwed || 0), 0);

  const totalCommissionsOwed = vendors
    .filter((vendor) => !vendor.suspended)
    .reduce((sum, vendor) => sum + (vendor.commissionsOwed || 0), 0);

  const activeUsers = vendors.filter((vendor) => !vendor.suspended);
  const suspendedUsers = vendors.filter((vendor) => vendor.suspended);

  const sortedUsers = [
    ...activeUsers.sort(
      (a, b) => b.unpaidRedeemedUsersCount - a.unpaidRedeemedUsersCount
    ),
    ...suspendedUsers.sort(
      (a, b) => b.unpaidRedeemedUsersCount - a.unpaidRedeemedUsersCount
    ),
  ];

  useEffect(() => {
    fetchVendors();
  }, [userType]);

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
          <p className="text-gray-500 font-medium">Loading {userType}s...</p>
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
        <p className="text-red-600 font-medium mb-2">
          Failed to load {userType}s
        </p>
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
        <p className="text-gray-500 font-medium">No {userType}s found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden lg:flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            All {userType === "vendor" ? "Vendors" : "Agents"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage and monitor {userType} accounts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {activeUsers.length} active{" "}
              {activeUsers.length === 1 ? userType : userType + "s"} (
              {suspendedUsers.length} suspended)
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Outstanding
            </div>
            <div className="text-sm font-bold text-[#d62e1f]">
              KSh {totalAmountOwed.toLocaleString()}
            </div>
          </div>

          {(userType === "agent" || userRole === "agent") && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Commissions
              </div>
              <div className="text-sm font-bold text-green-600">
                KSh {totalCommissionsOwed.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {userRole === "agent" && (
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-lg bg-[#d62e1f] px-4 py-2 text-sm font-medium text-gray-100 shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Create Vendor
            </Link>
          )}
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
              All {userType === "vendor" ? "Vendors" : "Agents"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor {userType} accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userRole === "admin" && (
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-lg bg-[#d62e1f] px-3 py-2 text-sm font-medium text-gray-100 shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Vendor</span>
              </Link>
            )}
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

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {activeUsers.length} active ({suspendedUsers.length} suspended)
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <TrendingUp className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Outstanding
              </div>
              <div className="text-sm font-bold text-[#d62e1f]">
                KSh {totalAmountOwed.toLocaleString()}
              </div>
            </div>
          </div>

          {(userType === "agent" || userRole === "agent") && (
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Commissions
                </div>
                <div className="text-sm font-bold text-green-600">
                  KSh {totalCommissionsOwed.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-[70vh] lg:h-[80vh]">
        <div className="overflow-y-auto h-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {userType === "vendor" ? "Vendor" : "Agent"}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Unpaid
                </th>
                {userRole === "admin" && userType === "vendor" && (
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Agent
                  </th>
                )}
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
              {sortedUsers.map((vendor) => (
                <tr
                  key={vendor._id}
                  className={`hover:bg-gradient-to-r cursor-pointer transition-all duration-300 border-b border-gray-200 hover:shadow-sm ${
                    vendor.suspended
                      ? "hover:from-red-50 hover:to-pink-50 hover:border-red-100 bg-red-50/90"
                      : "hover:from-green-50 hover:to-indigo-50 hover:border-green-100"
                  }`}
                  onClick={() => onVendorSelect(vendor)}
                >
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="">
                        <p
                          className={`text-sm font-medium capitalize ${
                            vendor.suspended ? "text-red-900" : "text-gray-900"
                          }`}
                        >
                          {vendor.firstName} {vendor.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    {vendor.unpaidRedeemedUsersCount > 0 ? (
                      <span className="inline-flex items-center justify-center px-3 font-medium rounded-[5px] bg-[#fff9f9] text-[#d62e1f] border-[1px] border-[#d62e1f]">
                        {vendor.unpaidRedeemedUsersCount}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  {userRole === "admin" && userType === "vendor" && (
                    <td className="px-6 py-2 whitespace-nowrap">
                      {vendor.agentName ? (
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {vendor.agentName}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-2 whitespace-nowrap">
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
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-sans text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                        {vendor.phoneNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(vendor.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
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
