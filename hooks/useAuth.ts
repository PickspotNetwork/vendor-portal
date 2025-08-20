import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, SignupRequest, LoginRequest } from "@/lib/api";
import { cleanupAuth } from "@/utils/authService";

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
          error: response.message || "Login failed",
          success: null,
        });
        return { success: false, error: response.message || "Login failed" };
      }

      // router.push("/dashboard");
      // router.refresh();
      // window.location.href = '/dashboard'
      window.location.reload();

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

  const logout = async () => {
    setAuthState({ isLoading: true, error: null, success: null });

    try {
      const response = await authApi.logout();
      setAuthState({
        isLoading: true,
        error: null,
        success: response.message || "Logging out...",
      });

      cleanupAuth();

      setTimeout(() => {
        router.push("/");
      }, 500);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      setAuthState({
        isLoading: false,
        error: errorMessage,
        success: null,
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    accessToken, setAccessToken,
    ...authState,
    signup,
    login,
    logout,
    clearMessages,
  };
}
