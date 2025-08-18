"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { DollarSign, User, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forceTokenRefresh, getTokenStatus } from "@/utils/authService";

interface RedeemedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isRedeemed: boolean;
  isPaid: boolean;
  redeemedAt: string;
  vendor: string;
  rewards?: {
    rewarded: boolean;
    totalPoints: number;
  };
}

interface ApiResponse {
  message: string;
  redeemedUsers: RedeemedUser[];
}

const refreshRedemptionsRef = { current: null as (() => void) | null };

export const refreshRedemptionsList = () => {
  if (refreshRedemptionsRef.current) {
    refreshRedemptionsRef.current();
  }
};

export default function RecentRedemptions() {
  const [redeemedUsers, setRedeemedUsers] = useState<RedeemedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshRedemptionsRef.current = fetchRedeemedUsers;
    return () => {
      refreshRedemptionsRef.current = null;
    };
  }, []);

  const fetchRedeemedUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const tokenStatus = getTokenStatus();
      if (tokenStatus.needsRefresh) {
        const refreshSuccess = await forceTokenRefresh();
        if (!refreshSuccess) {
          setError("Session expired. Please log in again.");
          return;
        }
      }

      const accessToken = Cookies.get("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-redeemed-users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          const refreshSuccess = await forceTokenRefresh();
          if (refreshSuccess) {
            const newAccessToken = Cookies.get("access_token");
            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/all-redeemed-users`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              },
            );

            const retryData: ApiResponse = await retryResponse.json();

            const sortedRetryUsers = (retryData.redeemedUsers || []).sort((a, b) => {
              return new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime();
            });
            setRedeemedUsers(sortedRetryUsers);
            return;
          } else {
            setError("Session expired. Please log in again.");
            return;
          }
        }
        console.log(data.message || "Failed to fetch redeemed users");
      }

      const sortedUsers = (data.redeemedUsers || []).sort((a, b) => {
        return new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime();
      });
      setRedeemedUsers(sortedUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch redeemed users";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRedeemedUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading redeemed users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to load</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <Button
          onClick={fetchRedeemedUsers}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Try again
        </Button>
      </div>
    );
  }

  if (redeemedUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No redemptions yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Start redeeming digital handles to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Redemptions
          </h3>
          <Button
            onClick={fetchRedeemedUsers}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>

        <div className="bg-black text-white rounded-xl p-4 border border-[#D62E1F]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide font-medium">
                Amount Earned
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                KSh {(redeemedUsers.length * 50).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 bg-[#D62E1F]/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {redeemedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-medium text-gray-900 truncate">
                  {user._id}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex">
                {user.isPaid ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs font-medium">Paid</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs font-medium">Unpaid</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 min-w-0">
                {formatDate(user.redeemedAt)}
              </div>
              <div className="sm:hidden">
                {user.isPaid ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
