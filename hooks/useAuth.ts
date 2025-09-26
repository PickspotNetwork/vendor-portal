import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  SignupRequest,
  LoginRequest,
  ApiResponse,
  LoginResponse,
} from "@/lib/api";
import Cookies from "js-cookie";
import { refreshToken } from "@/utils/authService";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/types/auth";

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const existingToken = Cookies.get("accessToken");

      if (existingToken) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          setAccessToken(newAccessToken);
        }
      }
    };

    fetchToken();
    const interval = setInterval(fetchToken, 13 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const clearMessages = () => {
    setAuthState((prev) => ({ ...prev, error: null, success: null }));
  };

  const signup = async (userData: SignupRequest) => {
    setAuthState({ isLoading: true, error: null, success: null });

    try {
      const response = await authApi.signup(userData);
      setAuthState({
        isLoading: false,
        error: null,
        success:
          response.message || "Account created successfully! Please login.",
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null,
      });
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials: LoginRequest) => {
    setAuthState({ isLoading: true, error: null, success: null });

    try {
      const response = await authApi.login(credentials);

      if (!response.ok || response.status !== 200) {
        setAuthState({
          isLoading: false,
          error: response.message || "Invalid credentials. Please try again.",
          success: null,
        });
        return { success: false, error: response.message || "Login failed" };
      }

      const accessToken =
        "accessToken" in response
          ? (response as ApiResponse<LoginResponse> & { accessToken: string })
              .accessToken
          : response.data?.accessToken;

      if (accessToken) {
        Cookies.set("accessToken", accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          path: "/",
        });
      }

      setAuthState({
        isLoading: false,
        error: null,
        success: response.message || "Login successful",
      });

      try {
        if (accessToken) {
          const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);
          if (decodedToken.suspended) {
            router.push("/suspended");
            return;
          }
          if (decodedToken.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error decoding token for routing:", error);
        router.push("/dashboard");
      }

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null,
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    accessToken,
    signup,
    login,
    clearMessages,
  };
}
