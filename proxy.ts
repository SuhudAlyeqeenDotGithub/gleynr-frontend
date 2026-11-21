import { NextRequest, NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const sessionType = request.cookies.get("gleynr_session_type")?.value;

  const isMainRoute = pathname.startsWith("/main");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isMainRoute) {
    if (sessionType !== "org" && sessionType !== "user") {
      return NextResponse.redirect(new URL("/auth/user/sign-in", request.url));
    }

    const session = request.cookies.get(
      sessionType === "org" ? "gleynr_org_session" : "gleynr_user_session",
    );

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/${sessionType}/sign-in`, request.url),
      );
    }
  }

  if (isAuthRoute && (sessionType === "org" || sessionType === "user")) {
    const session = request.cookies.get(
      sessionType === "org" ? "gleynr_org_session" : "gleynr_user_session",
    );

    if (session) {
      return NextResponse.redirect(new URL("/main", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/main/:path*", "/auth/:path*"],
};
