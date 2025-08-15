import { refreshToken } from "./authService";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiFetch(
  access_token: string | null,
  url: string,
  options: RequestInit = {},
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
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
