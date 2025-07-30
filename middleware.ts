import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Role-based access control
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Protect authenticated routes
    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Protect API routes
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/") && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/((?!auth|health).*)",
  ],
}