"use client";

import { useState } from "react";
import { Vendor } from "@/lib/api";
import { Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";

interface PaymentFormProps {
  vendor: Vendor;
  onPaymentSuccess: () => void;
}

export default function PaymentForm({
  vendor,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount.trim()) {
      setError("Please enter an amount");
      return;
    }

    const totalPayout = parseFloat(amount);
    if (isNaN(totalPayout) || totalPayout <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (vendor.role === "vendor" && totalPayout % 50 !== 0) {
      setError("Amount must be a multiple of 50 (KSh 50 per user)");
      return;
    }

    if (vendor.role === "vendor" && totalPayout < 100) {
      setError("Minimum payment for vendors is KSh 100");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found");
      setIsLoading(false);
      return;
    }

    const payUsers = async (token: string) => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/user/pay-users`;
        const payload = {
          vendorId: vendor._id,
          totalPayout: totalPayout,
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.status === 401) return null;

        if (!response.ok) {
          const data = await response.json();

          if (response.status === 404) {
            setError("No unpaid users for this vendor");
          } else {
            setError(data?.err || "Failed to process payment");
          }
          return null;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process payment";
        console.log(errorMessage);
        return null;
      }
    };

    try {
      let data = await payUsers(accessToken);

      if (!data) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          data = await payUsers(newAccessToken);
        } else {
          setError("Session expired");
          setIsLoading(false);
          return;
        }
      }

      if (data) {
        setSuccess(data.message || "Payment processed successfully");
        setAmount("");
        onPaymentSuccess();
      } else {
        console.log("Failed to process payment");
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
  };

  const expectedUsers = vendor.role === "vendor" && amount ? Math.floor(parseFloat(amount) / 50) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 ml-3">
          Process Payment
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Total Payout Amount (KSh)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={vendor.role === "agent" ? "Enter amount" : "Enter amount (min 100, e.g., 250)"}
            step={vendor.role === "agent" ? "1" : "50"}
            min={vendor.role === "agent" ? "1" : "100"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            disabled={isLoading}
          />
          {vendor.role === "vendor" && expectedUsers > 0 && (
            <p className="text-xs text-green-700 mt-1">
              This will mark {expectedUsers} user
              {expectedUsers !== 1 ? "s" : ""} as paid
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !amount.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Process Payment"
          )}
        </Button>
      </form>
    </div>
  );
}
