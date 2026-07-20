import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/proxy";

const guestOnlyRoutes = new Set([
  "/",
  "/auth",
  "/auth/login",
  "/auth/register",
  "/login",
  "/signup",
]);
const authCallbackRoutes = new Set(["/auth/callback"]);

const copyCookies = (from: NextResponse, to: NextResponse) => {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  return to;
};

const redirectWithSession = (
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) => copyCookies(response, NextResponse.redirect(new URL(pathname, request.url)));

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (authCallbackRoutes.has(pathname)) {
    return response;
  }

  if (isAuthenticated && guestOnlyRoutes.has(pathname)) {
    return redirectWithSession(request, response, "/home");
  }

  if (!isAuthenticated && !guestOnlyRoutes.has(pathname)) {
    return redirectWithSession(request, response, "/auth/login");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
