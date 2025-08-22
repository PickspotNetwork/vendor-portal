import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/settings"];
const PUBLIC_ROUTES = ["/", "/forgot-password"];
const API_ROUTES = ["/api"];

const isProduction = process.env.NODE_ENV === "production";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
    return null;
  }

  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;
    
    if (!refreshToken) {
      return null;
    }

    const refreshResponse = await fetch(`${baseUrl}/auth/vendors/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${refreshToken}`
      },
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      
      if (data.accessToken) {
        const response = NextResponse.next();

        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: isProduction,
          path: "/",
          maxAge: 15 * 60,
        });

        return response;
      }
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }

  return null;
}

function createLoginRedirect(req: NextRequest): NextResponse {
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

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (isProtectedRoute(pathname)) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      const refreshedResponse = await attemptTokenRefresh(req);
      if (refreshedResponse) {
        return refreshedResponse;
      }
    }

    return createLoginRedirect(req);
  }

  if (isPublicRoute(pathname) && pathname === "/" && accessToken) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
