import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) 
            return true;   // If not in admin section or login/register pages, deny access

        if (pathname === "/" || pathname.startsWith("/api/videos")) {
            return true; // Public access to home and video APIs
        }

        return !!token; // Require authentication for all other routes
        
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths expect:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
