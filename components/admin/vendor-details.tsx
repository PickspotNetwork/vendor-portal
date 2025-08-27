"use client";

import { useState, useEffect, useCallback } from "react";
import { RedeemedUser, Vendor } from "@/lib/api";
import { Loader2, User, ArrowLeft, RefreshCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";
import PaymentForm from "./payment-form";

interface VendorDetailsProps {
  vendor: Vendor;
  onBack: () => void;
}

export default function VendorDetails({ vendor, onBack }: VendorDetailsProps) {
  const [redeemedUsers, setRedeemedUsers] = useState<RedeemedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNoRedemptions, setHasNoRedemptions] = useState(false);

  const fetchRedeemedUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setHasNoRedemptions(false);

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found");
      setIsLoading(false);
      return;
    }

    const fetchRedeemed = async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-redeemed-users-per-vendor/${vendor._id}`,
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
          if (response.status === 404) {
            setHasNoRedemptions(true);
            setRedeemedUsers([]);
            setIsLoading(false);
            return "404_handled";
          } else {
            setError("Error fetching redeemed users");
            setIsLoading(false);
            return null;
          }
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch redeemed users";
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    };

    try {
      let data = await fetchRedeemed(accessToken);

      if (data === "404_handled") {
        return;
      }

      if (!data) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          data = await fetchRedeemed(newAccessToken);
          
          if (data === "404_handled") {
            return;
          }
        } else {
          setError("Session expired");
          setIsLoading(false);
          return;
        }
      }

      if (data && data.redeemedUsers) {
        const sortedUsers = data.redeemedUsers.sort(
          (a: RedeemedUser, b: RedeemedUser) =>
            new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
        );
        setRedeemedUsers(sortedUsers);
        setHasNoRedemptions(false);
      } else {
        setError("Failed to fetch redeemed users data");
        setRedeemedUsers([]);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [vendor._id]);

  useEffect(() => {
    fetchRedeemedUsers();
  }, [fetchRedeemedUsers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalEarnings = redeemedUsers.length * 50;
  const paidUsers = redeemedUsers.filter((user) => user.isPaid).length;
  const unpaidUsers = redeemedUsers.length - paidUsers;
  const amountPaid = paidUsers * 50;
  const amountUnpaid = unpaidUsers * 50;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Loading redeemed users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-red-600 font-medium mb-2">
            Failed to load redeemed users
          </p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchRedeemedUsers} variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
        <Button
          onClick={fetchRedeemedUsers}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {vendor.firstName} {vendor.lastName}
            </h1>
            <p className="text-gray-600">{vendor.phoneNumber}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">{vendor._id}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                vendor.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {vendor.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Redemptions</p>
              <p className="text-xl font-semibold text-gray-900">
                {redeemedUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-xl font-semibold text-gray-900">
                KSh {totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-xl font-semibold text-gray-900">
                KSh {amountPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Amount Unpaid</p>
              <p className="text-xl font-semibold text-red-600">
                KSh {amountUnpaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {hasNoRedemptions ? null : (
        <PaymentForm vendor={vendor} onPaymentSuccess={fetchRedeemedUsers} />
      )}

      {/* Redeemed Users Table */}
      {!hasNoRedemptions && redeemedUsers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No redemptions yet</p>
          <p className="text-sm text-gray-400 mt-1">
            This vendor hasn&apos;t redeemed any users
          </p>
        </div>
      ) : !hasNoRedemptions ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Redeemed Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Digital Handle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Redeemed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {redeemedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-mono text-gray-900">
                        {user._id}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.redeemedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
