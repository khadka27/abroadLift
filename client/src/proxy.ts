import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function handleProxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isAuthPage =
      path.startsWith("/login") ||
      path.startsWith("/register") ||
      path.startsWith("/signup") ||
      path.startsWith("/admin/login");

    if (isAuthPage && token) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "";
      const safeCallbackUrl =
        callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "";

      const redirectPath =
        token.role === "ADMIN" || token.role === "SUPERADMIN"
          ? "/admin/dashboard"
          : safeCallbackUrl || "/";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    if (
      path.startsWith("/admin") &&
      !path.startsWith("/admin/login") &&
      token?.role !== "ADMIN" &&
      token?.role !== "SUPERADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
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
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
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
  },
);

export const config = {
  matcher: [
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
