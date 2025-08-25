import { refreshToken } from "./authService";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiFetch(
  accessToken: string | null,
  url: string,
  options: RequestInit = {},
) {
  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const newAccessToken = await refreshToken();
    if (!newAccessToken) return response;

    response = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
      credentials: "include",
    });
  }
  return response;
}
