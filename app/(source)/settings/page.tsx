"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/ui/notification";
import { useUser } from "@/context/UserContext";
import { refreshToken } from "@/utils/authService";
import {
  validateFormInput,
  validatePhoneNumber,
  validateName,
} from "@/lib/input-sanitization";
import { validatePassword } from "@/lib/password-validation";
import { PasswordStrength } from "@/components/auth/password-strength";
import {
  User,
  ArrowLeft,
  Home,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleVendorSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();

    if (!user?.vendorId) {
      setError("Unable to identify agent. Please log in again.");
      return;
    }

    if (
      !signupForm.firstName ||
      !signupForm.lastName ||
      !signupForm.phoneNumber ||
      !signupForm.password
    ) {
      setError("All fields are required.");
      return;
    }

    const firstNameValidation = validateName(signupForm.firstName);
    if (!firstNameValidation.isValid) {
      setError(firstNameValidation.error || "Invalid first name provided.");
      return;
    }

    const lastNameValidation = validateName(signupForm.lastName);
    if (!lastNameValidation.isValid) {
      setError(lastNameValidation.error || "Invalid last name provided.");
      return;
    }

    const phoneValidation = validatePhoneNumber(signupForm.phoneNumber);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "Invalid phone number provided.");
      return;
    }

    const passwordStrengthValidation = validatePassword(signupForm.password);
    if (!passwordStrengthValidation.isValid) {
      setError("Password does not meet the required strength.");
      return;
    }

    const passwordSecurityValidation = validateFormInput(
      signupForm.password,
      "Password",
    );
    if (!passwordSecurityValidation.isValid) {
      setError(
        passwordSecurityValidation.errors[0] ||
          "Password contains invalid characters.",
      );
      return;
    }

    const payload = {
      firstName: firstNameValidation.sanitizedName,
      lastName: lastNameValidation.sanitizedName,
      phoneNumber: phoneValidation.sanitizedPhone,
      password: passwordSecurityValidation.sanitizedInput,
      agent: user.vendorId,
    };

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      setError("Access token not found. Please log in again.");
      return;
    }

    const createVendor = async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/vendors/create-vendor`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.status === 401) return null;

        const data = await response.json();

        if (!response.ok) {
          return {
            ok: false,
            message:
              data.err || data.message || "Failed to create vendor account.",
          };
        }

        return {
          ok: true,
          message: data.message || "Vendor account created successfully.",
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          message: "An unexpected error occurred. Please try again.",
        };
      }
    };

    setIsLoading(true);
    try {
      let result = await createVendor(accessToken);

      if (!result) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken);
          result = await createVendor(newAccessToken);
        } else {
          setError("Session expired. Please log in again.");
          setIsLoading(false);
          return;
        }
      }

      if (result && result.ok) {
        setSignupForm({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          password: "",
        });
        setSuccess(result.message);
      } else {
        setError(result?.message || "Failed to create vendor account.");
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-2">
        <Link
          href={
            user?.role === "admin"
              ? "/admin"
              : user?.role === "agent"
                ? "/agent"
                : "/dashboard"
          }
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#D62E1F] hover:bg-gray-50 rounded-lg transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <Home className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">
        {user?.role === "agent" && (
          <div className="pt-2">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#D62E1F]" />
              Sign Up a Vendor
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Create a vendor account on their behalf. Share the credentials
              with the vendor once the account is active.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleVendorSignup}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label
                    className="text-sm font-medium text-gray-700 mb-2 block"
                    htmlFor="agent-signup-firstname"
                  >
                    First Name
                  </Label>
                  <Input
                    id="agent-signup-firstname"
                    type="text"
                    placeholder="Jane"
                    value={signupForm.firstName}
                    onChange={(event) =>
                      setSignupForm((previous) => ({
                        ...previous,
                        firstName: event.target.value,
                      }))
                    }
                    disabled={isLoading}
                    required
                    className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
                  />
                </div>
                <div>
                  <Label
                    className="text-sm font-medium text-gray-700 mb-2 block"
                    htmlFor="agent-signup-lastname"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="agent-signup-lastname"
                    type="text"
                    placeholder="Doe"
                    value={signupForm.lastName}
                    onChange={(event) =>
                      setSignupForm((previous) => ({
                        ...previous,
                        lastName: event.target.value,
                      }))
                    }
                    disabled={isLoading}
                    required
                    className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
                  />
                </div>
              </div>

              <div>
                <Label
                  className="text-sm font-medium text-gray-700 mb-2 block"
                  htmlFor="agent-signup-phone"
                >
                  Phone Number
                </Label>
                <Input
                  id="agent-signup-phone"
                  type="tel"
                  placeholder="0708575242"
                  value={signupForm.phoneNumber}
                  onChange={(event) =>
                    setSignupForm((previous) => ({
                      ...previous,
                      phoneNumber: event.target.value,
                    }))
                  }
                  disabled={isLoading}
                  required
                  className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be a Safaricom number registered on M-Pesa.
                </p>
              </div>

              <div>
                <Label
                  className="text-sm font-medium text-gray-700 mb-2 block"
                  htmlFor="agent-signup-password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="agent-signup-password"
                    type={showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(event) =>
                      setSignupForm((previous) => ({
                        ...previous,
                        password: event.target.value,
                      }))
                    }
                    disabled={isLoading}
                    required
                    className="focus-visible:ring-[#D62E1F] focus-visible:ring-2 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword((previous) => !previous)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="mt-3">
                  <PasswordStrength password={signupForm.password} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Vendor Account"
                )}
              </Button>
            </form>
          </div>
        )}

        {user?.role !== "agent" && (
          <div className="space-y-6 mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-[#D62E1F]" />
              Profile Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    value={user?.firstName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    value={user?.lastName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </Label>
                <Input
                  value={user?.phoneNumber || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </Label>
                <Input
                  value={user?.role || ""}
                  disabled
                  className="bg-gray-50 capitalize"
                />
              </div>
            </div>
          </div>
        )}
      </div>

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
