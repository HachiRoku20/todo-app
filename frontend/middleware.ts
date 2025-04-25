// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";

export function middleware(req: NextRequest) {
  const token = Cookies.get("token");
  console.log("Middleware triggered");

  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"], // Apply to specific routes
};
