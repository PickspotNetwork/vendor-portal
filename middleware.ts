import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const protectedRoutes = ["/dashboard", "/settings"];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token && refreshToken) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/vendors/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: req.headers.get("cookie") || "",
            },
          },
        );

        if (response.ok) {
          const res = NextResponse.next();

          const setCookieHeaders = response.headers.getSetCookie();
          setCookieHeaders.forEach((cookie) => {
            res.headers.append("Set-Cookie", cookie);
          });

          return res;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/settings"],
};
