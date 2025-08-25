import Cookies from "js-cookie";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const refreshToken = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/vendors/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (response.status === 401) {
      console.warn("User not logged in, skipping token refresh.");
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    Cookies.set("accessToken", newAccessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
