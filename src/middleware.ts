import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

export function middleware(request: NextRequest) {
  const token = cookies().get(ACCESS_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  //!!! the problem is that when accessToken expires, it got deleted!!!

  if (token) {
    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
