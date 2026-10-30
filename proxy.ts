import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Отримуємо актуальний токен сесії
  const token = request.cookies.get("accessToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Неавторизований намагається зайти на приватні сторінки
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Вже авторизований намагається зайти на сторінки логіну чи реєстрації
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
