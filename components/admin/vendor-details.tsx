"use client";

import { useState, useEffect, useCallback } from "react";
import { RedeemedUser, Vendor } from "@/lib/api";
import {
  Loader2,
  User,
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Ban,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";
import PaymentForm from "./payment-form";

interface VendorDetailsProps {
  vendor: Vendor;
  onBack: () => void;
  userRole?: string;
}

export default function VendorDetails({
  vendor,
  onBack,
  userRole,
}: VendorDetailsProps) {
  const [redeemedUsers, setRedeemedUsers] = useState<RedeemedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNoRedemptions, setHasNoRedemptions] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [showSuspendSuccess, setShowSuspendSuccess] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const isAdmin = userRole === "admin";

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
          },
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
            new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime(),
        );
        setRedeemedUsers(sortedUsers);
        setHasNoRedemptions(false);
      } else {
        setError("Failed to fetch redeemed users data");
        setRedeemedUsers([]);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [vendor._id]);

  useEffect(() => {
    fetchRedeemedUsers();
  }, [fetchRedeemedUsers]);

  const handleSuspendVendor = () => {
    setShowSuspendModal(true);
  };

  const handleSuspendConfirm = async () => {
    setIsSuspending(true);
    setShowSuspendModal(false);
    setError("");

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found");
      setIsSuspending(false);
      return;
    }

    const suspendVendor = async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/suspend?vendorId=${vendor._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.status === 401) return null;

        if (!response.ok) {
          if (response.status === 404) {
            setError("Vendor not found");
            setIsSuspending(false);
            return "404_handled";
          } else {
            setError("Error suspending vendor");
            setIsSuspending(false);
            return null;
          }
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to suspend vendor";
        setError(errorMessage);
        setIsSuspending(false);
        return null;
      }
    };

    try {
      let data = await suspendVendor(accessToken);

      if (data === "404_handled") {
        return;
      }

      if (!data) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          data = await suspendVendor(newAccessToken);

          if (data === "404_handled") {
            return;
          }
        } else {
          setError("Session expired");
          setIsSuspending(false);
          return;
        }
      }

      if (data) {
        setSuspendMessage(
          data.msg || data.message || "Vendor has been suspended successfully",
        );
        setShowSuspendSuccess(true);
        setTimeout(() => setShowSuspendSuccess(false), 5000);
      } else {
        setError("Failed to suspend vendor");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSuspending(false);
    }
  };

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
    <div className="space-y-6 max-w-6xl mx-auto">
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
          {isAdmin && (
            <div className="text-right">
              <Button
                onClick={handleSuspendVendor}
                disabled={isSuspending}
                className="bg-[#d62e1f] hover:bg-[#b22e1f] text-white px-6 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                {isSuspending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" />
                    Suspend Vendor
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Commissions Owed</p>
                <p className="text-xl font-semibold text-green-600">
                  KSh {(amountUnpaid === 0 ? 0 : vendor.commissionsOwed).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
      </div>

      {isAdmin && !hasNoRedemptions && (
        <PaymentForm vendor={vendor} onPaymentSuccess={fetchRedeemedUsers} />
      )}

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

      {isAdmin && showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all border border-gray-100">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white opacity-60"></div>

              <div className="relative p-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuspendModal(false)}
                  className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 shadow-inner">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Suspend Vendor Account
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Are you sure you want to suspend{" "}
                      <span className="font-semibold text-gray-900">
                        {vendor.firstName} {vendor.lastName}
                      </span>
                      ? This action will immediately revoke their access to the
                      platform.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200">
                  <div className="text-center">
                    <p className="text-xs text-red-500 uppercase tracking-wide font-medium mb-1">
                      Vendor ID
                    </p>
                    <p className="text-sm font-mono text-red-900 break-all font-medium">
                      {vendor._id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSuspendModal(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSuspendConfirm}
                    disabled={isSuspending}
                    className="flex-1 bg-[#d62e1f] hover:bg-[#b22e1f] text-white"
                  >
                    {isSuspending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Suspending...
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuspendSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Vendor Suspended Successfully
              </h3>
              <p className="text-gray-600 mb-6">{suspendMessage}</p>
              <Button
                onClick={() => setShowSuspendSuccess(false)}
                className="bg-[#d62e1f] hover:bg-[#b22e1f] text-white px-6 py-2 rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
