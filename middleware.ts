import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const protectedRoutes = ["/dashboard", "/settings", "/admin", "/agent"];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token && refreshToken) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/vendors/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        const data = await response.json();
        if (response.ok) {
          token = data.accessToken;
          const res = NextResponse.next();
          res.cookies.set("accessToken", data.accessToken, {
            httpOnly: true,
            path: "/",
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    "/dashboard",
    "/settings",
    "/admin",
    "/agent",
  ],
};
