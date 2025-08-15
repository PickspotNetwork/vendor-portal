const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const TOKEN_REFRESH_INTERVAL = 13 * 60 * 1000;
const TOKEN_EXPIRY_TIME = 15 * 60 * 1000;

interface TokenManager {
  refreshTimer: NodeJS.Timeout | null;
  isRefreshing: boolean;
  lastRefreshTime: number;
}

const tokenManager: TokenManager = {
  refreshTimer: null,
  isRefreshing: false,
  lastRefreshTime: 0,
};

export const refreshToken = async (): Promise<boolean> => {
  if (tokenManager.isRefreshing) {
    return false;
  }

  tokenManager.isRefreshing = true;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/vendors/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        stopTokenRefresh();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } else {
        console.warn("Token refresh failed with status:", response.status);
      }
      return false;
    }

    tokenManager.lastRefreshTime = Date.now();
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  } finally {
    tokenManager.isRefreshing = false;
  }
};

export const startTokenRefresh = (): void => {
  if (tokenManager.refreshTimer) {
    clearInterval(tokenManager.refreshTimer);
  }

  tokenManager.lastRefreshTime = Date.now();

  tokenManager.refreshTimer = setInterval(async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - tokenManager.lastRefreshTime;

    if (timeSinceLastRefresh >= TOKEN_REFRESH_INTERVAL) {
      const success = await refreshToken();

      if (!success) {
        stopTokenRefresh();
      }
    }
  }, TOKEN_REFRESH_INTERVAL);
};

export const stopTokenRefresh = (): void => {
  if (tokenManager.refreshTimer) {
    clearInterval(tokenManager.refreshTimer);
    tokenManager.refreshTimer = null;
    console.log("Token refresh timer stopped");
  }
};

export const getTokenStatus = () => {
  const now = Date.now();
  const timeSinceLastRefresh = now - tokenManager.lastRefreshTime;
  const timeUntilExpiry = TOKEN_EXPIRY_TIME - timeSinceLastRefresh;

  return {
    isActive: tokenManager.refreshTimer !== null,
    isRefreshing: tokenManager.isRefreshing,
    lastRefreshTime: tokenManager.lastRefreshTime,
    timeSinceLastRefresh,
    timeUntilExpiry: Math.max(0, timeUntilExpiry),
    needsRefresh: timeSinceLastRefresh >= TOKEN_REFRESH_INTERVAL,
  };
};

export const forceTokenRefresh = async (): Promise<boolean> => {
  return await refreshToken();
};

export const initializeAuth = (): void => {
  startTokenRefresh();
};

export const cleanupAuth = (): void => {
  stopTokenRefresh();
  tokenManager.lastRefreshTime = 0;
};
