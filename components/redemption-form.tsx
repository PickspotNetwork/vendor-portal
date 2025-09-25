"use client";

import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/components/ui/notification";
import { validateFormInput } from "@/lib/input-sanitization";
import { refreshToken } from "@/utils/authService";
import { refreshRedemptionsList } from "@/components/recent-redemptions";
import { Loader2, Search, CheckCircle, X, AlertCircle } from "lucide-react";

interface RedemptionResult {
  userId?: string;
  digitalHandle?: string;
  status?: string;
  timestamp?: string;
  message?: string;
  [key: string]: unknown;
}

export default function RedemptionForm() {
  const [digitalHandle, setDigitalHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redeemResult, setRedeemResult] = useState<RedemptionResult | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setRedeemResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith("@") && !value.includes("@pickspot.world")) {
      const newValue = value + "pickspot.world";
      setDigitalHandle(newValue);
      setTimeout(() => {
        const input = e.target;
        if (input.type === "text") {
          input.setSelectionRange(value.length, value.length);
        }
      }, 0);
    } else {
      setDigitalHandle(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!digitalHandle.trim()) {
      setError("Please enter a digital handle");
      return;
    }

    const validation = validateFormInput(
      digitalHandle.trim(),
      "Digital Handle",
    );
    if (!validation.isValid) {
      setError("Digital handle contains invalid characters");
      return;
    }

    const emailRegex = /^[^\s@]+@pickspot\.world$/;
    if (!emailRegex.test(digitalHandle.trim())) {
      setError("Please enter a valid digital handle username@pickspot.world");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setRedeemResult(null);
    setShowModal(false);

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found");
      setIsLoading(false);
      return;
    }

    const redeemHandle = async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/redeem/${digitalHandle.trim().toLowerCase()}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.status === 401) return null;

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setRedeemResult({
              digitalHandle: digitalHandle.trim(),
              status: "not_found",
              message:
                data.err ||
                data.message ||
                "This user hasn't acquired a digital handle yet",
              userId: undefined,
            });
          } else if (
            response.status === 400 &&
            (data.err === "User is already redeemed" ||
              data.message?.includes("already redeemed"))
          ) {
            setRedeemResult({
              digitalHandle: digitalHandle.trim(),
              status: "already_redeemed",
              message: "User has already been redeemed",
              userId: undefined,
            });
          } else {
            setRedeemResult({
              digitalHandle: digitalHandle.trim(),
              status: "error",
              message:
                data.err || data.message || "Failed to redeem digital handle",
              userId: undefined,
            });
          }
          setShowModal(true);
          setDigitalHandle("");
          setIsLoading(false);
          return "error";
        }

        setRedeemResult({
          digitalHandle: digitalHandle.trim(),
          status: "success",
          message: data.message || "User was redeemed successfully",
          userId: data.redeemedUser?._id,
          timestamp: data.redeemedUser?.redeemedAt,
        });
        setShowModal(true);
        setDigitalHandle("");
        refreshRedemptionsList();
        setIsLoading(false);

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to redeem digital handle";
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    };

    try {
      let data = await redeemHandle(accessToken);

      if (data === null) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          data = await redeemHandle(newAccessToken);
        } else {
          setError("Session expired");
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="digitalHandle"
            className="text-sm font-medium text-gray-700"
          >
            Digital Handle
          </Label>
          <div className="mt-1 relative">
            <Input
              id="digitalHandle"
              type="text"
              value={digitalHandle}
              onChange={handleInputChange}
              placeholder="e.g., dennis@pickspot.world"
              disabled={isLoading}
              className="pl-10 focus:ring-[#D62E1F] focus:border-[#D62E1F]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter the digital handle of the Pickspot app user you want to redeem
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !digitalHandle.trim()}
          className="w-full bg-black hover:bg-[#B8251A] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Redeeming...
            </>
          ) : (
            <>Redeem Digital Handle</>
          )}
        </Button>
      </form>

      {showModal && redeemResult && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all border border-gray-100">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-60"></div>

              <div className="relative p-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 shadow-inner">
                    {redeemResult.status === "not_found" ||
                    redeemResult.status === "error" ||
                    redeemResult.status === "already_redeemed" ? (
                      <AlertCircle className="h-8 w-8 text-gray-600" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-gray-600" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {redeemResult.status === "not_found" ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900">
                          User Not Found
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          This user hasn&apos;t downloaded the Pickspot app yet
                          or hasn&apos;t claimed their digital handle
                        </p>
                      </>
                    ) : redeemResult.status === "already_redeemed" ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900">
                          Already Redeemed
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          This user has already been redeemed.
                        </p>
                      </>
                    ) : redeemResult.status === "error" ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900">
                          Something Went Wrong
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Unable to process the redemption at this time
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-900">
                          Success!
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          User has been successfully redeemed
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Digital Handle
                    </p>
                    <p className="text-sm font-mono text-gray-900 break-all font-medium">
                      {redeemResult.digitalHandle}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="bg-[#D62E1F] hover:bg-[#B8251A] text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Okay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
