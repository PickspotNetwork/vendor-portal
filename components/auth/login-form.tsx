"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/components/ui/notification";
import Image from "next/image";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  validateFormInput,
  validatePhoneNumber,
  validateName,
} from "@/lib/input-sanitization";
import { validatePassword } from "@/lib/password-validation";
// import { PasswordStrength } from "@/components/auth/password-strength";
import TermsModal from "./terms-modal";

type LoginFormState = {
  phoneNumber: string;
  password: string;
};

// type SignupFormState = {
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   password: string;
// };

function LoginFields({
  loginForm,
  setLoginForm,
  isLoading,
  onSwitchToSignup,
}: {
  loginForm: LoginFormState;
  setLoginForm: Dispatch<SetStateAction<LoginFormState>>;
  isLoading: boolean;
  onSwitchToSignup: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-balance">
          Login to your Pickspot Vendor account
        </p>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="login-phone">Phone Number</Label>
        <Input
          id="login-phone"
          type="tel"
          placeholder="0701234567"
          value={loginForm.phoneNumber}
          onChange={(e) =>
            setLoginForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
          }
          required
          disabled={isLoading}
          className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
        />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center">
          <Label htmlFor="login-password">Password</Label>
          <Link
            href="/forgot-password"
            className="ml-auto text-sm underline-offset-2 hover:underline hover:text-[#D62E1F] transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            disabled={isLoading}
            className="focus-visible:ring-[#D62E1F] focus-visible:ring-2 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Don&apos;t have an account?{" "}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onSwitchToSignup}
        disabled={isLoading}
      >
        Sign up
      </Button>
    </>
  );
}

// function SignupFields({
//   signupForm,
//   setSignupForm,
//   isLoading,
//   onSwitchToLogin,
// }: {
//   signupForm: SignupFormState;
//   setSignupForm: Dispatch<SetStateAction<SignupFormState>>;
//   isLoading: boolean;
//   onSwitchToLogin: () => void;
// }) {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <>
//       <div className="flex flex-col items-center text-center">
//         <h1 className="text-2xl font-bold">Create account</h1>
//         <p className="text-muted-foreground text-balance">
//           Join Pickspot Vendor platform
//         </p>
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="signup-firstname">First Name</Label>
//         <Input
//           id="signup-firstname"
//           type="text"
//           placeholder="John"
//           value={signupForm.firstName}
//           onChange={(e) =>
//             setSignupForm((prev) => ({ ...prev, firstName: e.target.value }))
//           }
//           required
//           disabled={isLoading}
//           className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
//         />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="signup-lastname">Last Name</Label>
//         <Input
//           id="signup-lastname"
//           type="text"
//           placeholder="Doe"
//           value={signupForm.lastName}
//           onChange={(e) =>
//             setSignupForm((prev) => ({ ...prev, lastName: e.target.value }))
//           }
//           required
//           disabled={isLoading}
//           className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
//         />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="signup-phone">Phone Number</Label>
//         <Input
//           id="signup-phone"
//           type="tel"
//           placeholder="0708575242"
//           value={signupForm.phoneNumber}
//           onChange={(e) =>
//             setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
//           }
//           required
//           disabled={isLoading}
//           className="focus-visible:ring-[#D62E1F] focus-visible:ring-2"
//         />
//         <p className="text-xs text-gray-500">
//           Must be a Safaricom number registered on M-Pesa
//         </p>
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="signup-password">Password</Label>
//         <div className="relative">
//           <Input
//             id="signup-password"
//             type={showPassword ? "text" : "password"}
//             value={signupForm.password}
//             onChange={(e) =>
//               setSignupForm((prev) => ({ ...prev, password: e.target.value }))
//             }
//             required
//             disabled={isLoading}
//             className="focus-visible:ring-[#D62E1F] focus-visible:ring-2 pr-10"
//           />
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
//             onClick={() => setShowPassword(!showPassword)}
//             disabled={isLoading}
//           >
//             {showPassword ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//         <PasswordStrength password={signupForm.password} />
//       </div>
//       <Button type="submit" className="w-full" disabled={isLoading}>
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Creating Account...
//           </>
//         ) : (
//           "Create Account"
//         )}
//       </Button>
//       <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
//         <span className="bg-card text-muted-foreground relative z-10 px-2">
//           Already have an account?{" "}
//         </span>
//       </div>
//       <Button
//         type="button"
//         variant="outline"
//         className="w-full"
//         onClick={onSwitchToLogin}
//         disabled={isLoading}
//       >
//         Login
//       </Button>
//     </>
//   );
// }

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { isLoading, error, login, signup, clearMessages } = useAuth();

  const [loginForm, setLoginForm] = useState({
    phoneNumber: "",
    password: "",
  });

  const [signupForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!loginForm.phoneNumber || !loginForm.password) {
      return;
    }

    const phoneValidation = validatePhoneNumber(loginForm.phoneNumber);
    if (!phoneValidation.isValid) {
      return;
    }

    const passwordValidation = validateFormInput(
      loginForm.password,
      "Password",
    );
    if (!passwordValidation.isValid) {
      return;
    }

    const payload = {
      phoneNumber: phoneValidation.sanitizedPhone,
      password: passwordValidation.sanitizedInput,
    };
    const result = await login(payload);
    console.log("Login result", result);
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (
      !signupForm.firstName ||
      !signupForm.lastName ||
      !signupForm.phoneNumber ||
      !signupForm.password
    ) {
      return;
    }

    const firstNameValidation = validateName(signupForm.firstName);
    if (!firstNameValidation.isValid) {
      return;
    }

    const lastNameValidation = validateName(signupForm.lastName);
    if (!lastNameValidation.isValid) {
      return;
    }

    const phoneValidation = validatePhoneNumber(signupForm.phoneNumber);
    if (!phoneValidation.isValid) {
      return;
    }

    const passwordStrengthValidation = validatePassword(signupForm.password);
    if (!passwordStrengthValidation.isValid) {
      return;
    }

    const passwordSecurityValidation = validateFormInput(
      signupForm.password,
      "Password",
    );
    if (!passwordSecurityValidation.isValid) {
      return;
    }

    const payload = {
      firstName: firstNameValidation.sanitizedName,
      lastName: lastNameValidation.sanitizedName,
      phoneNumber: phoneValidation.sanitizedPhone,
      password: passwordSecurityValidation.sanitizedInput,
    };
    console.log("[SignupForm] submitting payload", {
      ...payload,
      password: "***",
    });
    const result = await signup(payload);
    console.log("[SignupForm] signup result", result);

    if (result.success) {
      setTimeout(() => {
        setActiveTab("login");
        setLoginForm((prev) => ({
          ...prev,
          phoneNumber: signupForm.phoneNumber,
        }));
      }, 2000);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                  activeTab === "login"
                    ? "bg-black text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                  activeTab === "signup"
                    ? "bg-black text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <form
              className="flex flex-col gap-6"
              onSubmit={
                activeTab === "login" ? handleLoginSubmit : handleSignupSubmit
              }
            >
              {activeTab === "login" ? (
                <LoginFields
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  isLoading={isLoading}
                  onSwitchToSignup={() => {
                    setActiveTab("signup");
                    clearMessages();
                  }}
                />
              ) : (
                <>
                  {/* <SignupFields
  signupForm={signupForm}
  setSignupForm={setSignupForm}
  isLoading={isLoading}
  onSwitchToLogin={() => {
    setActiveTab("login");
    clearMessages();
  }}
/> */}

                  <div className="text-center py-8 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Vendor Registration Temporarily Closed
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We&apos;ve reached our current capacity for new vendors.{" "}
                      <br />
                      Our existing vendor network is thriving and we want to
                      ensure the best experience for everyone.
                    </p>

                    <button
                      onClick={() => {
                        setActiveTab("login");
                        clearMessages();
                      }}
                      className="mt-4 text-sm text-[#D62E1F] hover:text-[#B22E1F] font-medium transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/app.png"
              alt="pickspot app"
              width={4620}
              height={7004}
              priority
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <button
          type="button"
          onClick={() => setShowTermsModal(true)}
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <a
          href="https://www.pickspot.net/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>

      {error && (
        <Notification type="error" message={error} onClose={clearMessages} />
      )}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
