import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard")) return !!token;
        return true;
      },
    },
    pages: {
      signIn: "/auth",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
