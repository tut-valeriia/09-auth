import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = Boolean(accessToken);
  let sessionResponse: any = null;

  if (!accessToken && refreshToken) {
    try {
      sessionResponse = await checkSession();
      if (sessionResponse?.data) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const applySetCookies = (response: NextResponse) => {
    if (sessionResponse?.headers?.["set-cookie"]) {
      const setCookies = sessionResponse.headers["set-cookie"];
      const cookieArray = Array.isArray(setCookies) ? setCookies : [setCookies];

      cookieArray.forEach((cookieStr: string) => {
        response.headers.append("set-cookie", cookieStr);
      });
    }
    return response;
  };

  if (isPrivateRoute && !isAuthenticated) {
    const redirectResponse = NextResponse.redirect(
      new URL("/sign-in", request.url),
    );
    return applySetCookies(redirectResponse);
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    return applySetCookies(redirectResponse);
  }

  const response = NextResponse.next();
  return applySetCookies(response);
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
