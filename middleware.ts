import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/settings"];
const PUBLIC_ROUTES = ["/", "/forgot-password"];
const API_ROUTES = ["/api"];

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
function logMiddlewareActivity(
  req: NextRequest,
  context: {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    action: string;
    details?: Record<string, unknown>;
  }
) {
  if (isDevelopment) {
    console.log(`[Middleware] ${context.action}`, {
      path: req.nextUrl.pathname,
      method: req.method,
      hasAccessToken: context.hasAccessToken,
      hasRefreshToken: context.hasRefreshToken,
      userAgent: req.headers.get("user-agent")?.substring(0, 50),
      host: req.headers.get("host"),
      ...context.details,
    });
  }
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
}

function isApiRoute(pathname: string): boolean {
  return API_ROUTES.some(route => pathname.startsWith(route));
}

async function attemptTokenRefresh(req: NextRequest): Promise<NextResponse | null> {
  if (!baseUrl) {
    logMiddlewareActivity(req, {
      hasAccessToken: false,
      hasRefreshToken: true,
      action: "REFRESH_FAILED",
      details: { reason: "Missing NEXT_PUBLIC_BASE_URL" }
    });
    return null;
  }

  try {
    const refreshResponse = await fetch(`${baseUrl}/auth/vendors/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (refreshResponse.ok) {
      logMiddlewareActivity(req, {
        hasAccessToken: false,
        hasRefreshToken: true,
        action: "REFRESH_SUCCESS",
        details: { status: refreshResponse.status }
      });

      const response = NextResponse.next();
      
      const setCookieHeaders = refreshResponse.headers.getSetCookie();
      setCookieHeaders.forEach((cookieHeader) => {
        response.headers.append("Set-Cookie", cookieHeader);
      });

      return response;
    } else {
      logMiddlewareActivity(req, {
        hasAccessToken: false,
        hasRefreshToken: true,
        action: "REFRESH_FAILED",
        details: { 
          status: refreshResponse.status,
          statusText: refreshResponse.statusText 
        }
      });
    }
  } catch (error) {
    logMiddlewareActivity(req, {
      hasAccessToken: false,
      hasRefreshToken: true,
      action: "REFRESH_ERROR",
      details: { 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    });
  }

  return null;
}

function createLoginRedirect(req: NextRequest, reason: string): NextResponse {
  logMiddlewareActivity(req, {
    hasAccessToken: false,
    hasRefreshToken: false,
    action: "REDIRECT_TO_LOGIN",
    details: { reason }
  });

  const loginUrl = new URL("/", req.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    isApiRoute(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get cookies - backend sets httpOnly differently based on environment
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // In production, if cookies aren't accessible via req.cookies, 
  // check the raw Cookie header as fallback
  let hasAccessTokenInHeader = false;
  let hasRefreshTokenInHeader = false;
  
  if (isProduction && (!accessToken || !refreshToken)) {
    const cookieHeader = req.headers.get("cookie") || "";
    hasAccessTokenInHeader = cookieHeader.includes("access_token=");
    hasRefreshTokenInHeader = cookieHeader.includes("refresh_token=");
  }

  // Determine if we have valid authentication considering environment differences
  const hasValidAccessToken = !!accessToken || (isProduction && hasAccessTokenInHeader);
  const hasValidRefreshToken = !!refreshToken || (isProduction && hasRefreshTokenInHeader);

  logMiddlewareActivity(req, {
    hasAccessToken: hasValidAccessToken,
    hasRefreshToken: hasValidRefreshToken,
    action: "MIDDLEWARE_START",
    details: { 
      isProtected: isProtectedRoute(pathname),
      isPublic: isPublicRoute(pathname),
      environment: isProduction ? "production" : "development",
      cookieHeaderCheck: isProduction ? { hasAccessTokenInHeader, hasRefreshTokenInHeader } : undefined
    }
  });

  if (isProtectedRoute(pathname)) {
    // In development: check actual cookie values
    // In production: trust that cookies exist in header (they're HttpOnly)
    if (hasValidAccessToken) {
      logMiddlewareActivity(req, {
        hasAccessToken: true,
        hasRefreshToken: hasValidRefreshToken,
        action: "ACCESS_GRANTED",
        details: { reason: "Valid access token detected" }
      });
      return NextResponse.next();
    }

    if (hasValidRefreshToken) {
      const refreshedResponse = await attemptTokenRefresh(req);
      if (refreshedResponse) {
        return refreshedResponse;
      }
    }

    return createLoginRedirect(req, "No valid authentication");
  }

  if (isPublicRoute(pathname) && pathname === "/") {
    if (hasValidAccessToken) {
      logMiddlewareActivity(req, {
        hasAccessToken: true,
        hasRefreshToken: hasValidRefreshToken,
        action: "REDIRECT_TO_DASHBOARD",
        details: { reason: "Already authenticated" }
      });
      
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  logMiddlewareActivity(req, {
    hasAccessToken: hasValidAccessToken,
    hasRefreshToken: hasValidRefreshToken,
    action: "ACCESS_GRANTED",
    details: { reason: "Public route or unprotected path" }
  });

  return NextResponse.next();
}

/**
 * Middleware configuration
 * 
 * Matcher configuration to optimize performance by only running middleware
 * on routes that actually need authentication checking
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
