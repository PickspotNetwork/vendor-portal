const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  status: number;
  ok: boolean;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface SignupResponse {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
}

export interface LogoutResponse {
  status: string;
}

export interface ForgotPasswordRequest {
  phoneNumber: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface ResetPasswordRequest {
  phoneNumber: string;
  newPassword: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  try {
    const response = await fetch(url, config);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {
        message: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    if (!response.ok) {
      const errorMessage =
        data.err ||
        data.message ||
        data.error ||
        response.statusText ||
        `Request failed with status ${response.status}`;
      console.log(`❌ API Error:`, errorMessage);

      return {
        ...data,
        status: response.status,
        ok: false,
        message: errorMessage,
      };
    }

    return {
      ...data,
      status: response.status,
      ok: true,
    };
  } catch (error) {
    console.log(`💥 API Call Failed:`, error);

    return {
      message:
        error instanceof Error
          ? error.message
          : "Network error occurred. Please check your connection and try again.",
      status: 0,
      ok: false,
    };
  }
}

export const authApi = {
  async signup(userData: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    return apiCall<SignupResponse>("/auth/vendors/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiCall<LoginResponse>("/auth/vendors/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    return apiCall<LogoutResponse>("/auth/vendors/logout", {
      method: "POST",
    });
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return apiCall("/auth/vendors/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async verifyResetCode(data: VerifyResetCodeRequest): Promise<ApiResponse> {
    return apiCall("/auth/vendors/verify-reset-code", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return apiCall("/auth/vendors/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async redeemDigitalHandle(digitalHandle: string): Promise<ApiResponse> {
    return apiCall(`/user/redeem/${digitalHandle}`, {
      method: "PATCH",
    });
  },

  async refreshToken(): Promise<ApiResponse> {
    return apiCall("/auth/vendors/refresh", {
      method: "POST",
    });
  },
};
