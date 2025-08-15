"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/components/ui/notification";
import { useState, FormEvent } from "react";
import { authApi } from "@/lib/api";
import { Loader2, ArrowLeft, Shield, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordStrength } from "@/components/auth/password-strength";
import { validatePassword } from "@/lib/password-validation";
import {
  validatePhoneNumber,
  validateFormInput,
} from "@/lib/input-sanitization";

type Step = "phone" | "code" | "password";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "Invalid phone number format");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword({
        phoneNumber: phoneValidation.sanitizedPhone,
      });
      setSuccess(response.message || "Reset code sent to your phone");
      setPhoneNumber(phoneValidation.sanitizedPhone);
      setTimeout(() => {
        setCurrentStep("code");
        setSuccess(null);
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send reset code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!resetCode.trim()) {
      setError("Please enter the reset code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyResetCode({ resetCode });
      setSuccess(response.message || "Code verified successfully");
      setTimeout(() => {
        setCurrentStep("password");
        setSuccess(null);
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordStrengthValidation = validatePassword(newPassword);
    if (!passwordStrengthValidation.isValid) {
      setError("Password does not meet security requirements");
      return;
    }

    const passwordSecurityValidation = validateFormInput(
      newPassword,
      "Password",
    );
    if (!passwordSecurityValidation.isValid) {
      setError("Password contains potentially dangerous content");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({
        phoneNumber,
        newPassword: passwordSecurityValidation.sanitizedInput,
      });
      setSuccess(response.message || "Password reset successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case "phone":
        return <Shield className="h-8 w-8 text-[#D62E1F]" />;
      case "code":
        return <KeyRound className="h-8 w-8 text-[#D62E1F]" />;
      case "password":
        return <KeyRound className="h-8 w-8 text-[#D62E1F]" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "phone":
        return "Forgot Password";
      case "code":
        return "Enter Reset Code";
      case "password":
        return "Set New Password";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "phone":
        return "Enter your phone number to receive a reset code";
      case "code":
        return "Enter the 6-digit code sent to your phone";
      case "password":
        return "Create a new secure password for your account";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-4">
              {getStepIcon()}
              <div>
                <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
                <p className="text-muted-foreground text-balance">
                  {getStepDescription()}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0708575242"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D62E1F] hover:bg-[#B8251A] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-[#D62E1F] inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        );

      case "code":
        return (
          <form onSubmit={handleCodeSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-4">
              {getStepIcon()}
              <div>
                <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
                <p className="text-muted-foreground text-balance">
                  {getStepDescription()}
                </p>
                <p className="text-sm text-[#D62E1F] mt-2">
                  Code sent to {phoneNumber}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="code">Reset Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="414372"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
                className="text-center text-lg tracking-widest focus-visible:ring-[#D62E1F] focus-visible:ring-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D62E1F] hover:bg-[#B8251A] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setCurrentStep("phone")}
                className="text-sm text-muted-foreground hover:text-[#D62E1F] inline-flex items-center gap-1"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4" />
                Change Phone Number
              </button>
            </div>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-4">
              {getStepIcon()}
              <div>
                <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
                <p className="text-muted-foreground text-balance">
                  {getStepDescription()}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
              />
              <PasswordStrength password={newPassword} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D62E1F] hover:bg-[#B8251A] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        );
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-8">{renderStepContent()}</CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By resetting your password, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#D62E1F]"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#D62E1F]"
        >
          Privacy Policy
        </a>
        .
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
