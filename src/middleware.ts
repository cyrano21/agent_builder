import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Role-based route protection
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    if (pathname.startsWith("/api/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/protected/:path*",
  ],
};