/* eslint-disable @typescript-eslint/no-explicit-any */
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const origin = req.headers.get("origin") || "*";

  // Handle CORS for /api routes
  if (path.startsWith("/api")) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };

    // Preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return NextResponse.json({}, { headers: corsHeaders, status: 200 });
    }

    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Handle Auth for protected non-API routes
  return (withAuth as any)(
    function handleProxy(authReq: any) {
      const token = authReq.nextauth?.token;

      const isAuthPage =
        path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/signup") ||
        path.startsWith("/admin/login");

      if (isAuthPage && token) {
        const callbackUrl = authReq.nextUrl.searchParams.get("callbackUrl") || "";
        const safeCallbackUrl =
          callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
            ? callbackUrl
            : "";

        const redirectPath =
          token.role === "ADMIN" || token.role === "SUPERADMIN"
            ? "/admin/dashboard"
            : safeCallbackUrl || "/";
        return NextResponse.redirect(new URL(redirectPath, authReq.url));
      }

      if (
        path.startsWith("/admin") &&
        !path.startsWith("/admin/login") &&
        token?.role !== "ADMIN" &&
        token?.role !== "SUPERADMIN"
      ) {
        return NextResponse.redirect(new URL("/", authReq.url));
      }

      const studentRoutes = [
        "/profile",
        "/dashboard",
        "/matches",
        "/applications",
        "/eligibility",
        "/costing",
      ];
      if (
        studentRoutes.some((route) => path.startsWith(route)) &&
        (token?.role === "ADMIN" || token?.role === "SUPERADMIN")
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", authReq.url));
      }
    },
    {
      callbacks: {
        authorized: ({ token }: any) => {
          if (
            path.startsWith("/login") ||
            path.startsWith("/register") ||
            path.startsWith("/signup") ||
            path.startsWith("/admin/login")
          ) {
            return true;
          }
          return !!token;
        },
      },
      pages: {
        signIn: "/login",
      },
    }
  )(req, {} as any);
}

export default proxy;

export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/register",
    "/signup",
    "/profile/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/eligibility/:path*",
    "/costing/:path*",
    "/admin/:path*",
  ],
};
