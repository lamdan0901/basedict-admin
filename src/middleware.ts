import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { getRefreshToken } from "@/service/auth";

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value;
  const refreshToken = cookies().get(REFRESH_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  if (!accessToken && refreshToken) {
    try {
      const res = await getRefreshToken(refreshToken);
      const { access_token, expires_in, refresh_token, expires_at } = res.data;

      if (access_token) {
        const response = NextResponse.next();
        response.cookies.set({
          name: ACCESS_TOKEN,
          value: access_token,
          secure: true,
          maxAge: expires_in,
          sameSite: "strict",
          path: "/",
        });
        response.cookies.set({
          name: REFRESH_TOKEN,
          value: refresh_token,
          secure: true,
          maxAge: expires_at,
          sameSite: "strict",
          path: "/",
        });
        return response;
      }

      return NextResponse.redirect(new URL("/login", request.url));
    } catch (error) {
      console.error("Error refreshing token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (accessToken || refreshToken) {
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

// Middleware vs. Route Handlers:
// The cookies() API behaves differently in middleware compared to route handlers.
// In middleware, cookies are read-only, while in route handlers, they can be both read and written.
// When you tried to call this route from the middleware,
// you were essentially creating a new request/response cycle, and the cookies set in that cycle
// wouldn't affect the original request being processed by the middleware.

// Response Modification:
// When you call this route from the middleware, you're creating a new request.
// The cookies set in the response of this new request won't automatically be applied
// to the original request/response cycle handled by the middleware.

// Cookie Persistence:
// Setting a cookie in a route handler persists it for future requests,
// but it doesn't immediately make it available to the current request being processed by the middleware.

// Timing and Execution Context:
// The middleware executes before the route handlers.
// If you're calling this route from the middleware,
// it might be too early in the request lifecycle to effectively set cookies for the current request.
