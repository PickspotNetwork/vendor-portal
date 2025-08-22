import { refreshToken } from "./authService";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiFetch(
  url: string,
  options: RequestInit = {},
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (!refreshed) return response;

    const retryHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    response = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: retryHeaders,
      credentials: "include",
    });
  }
  return response;
}
