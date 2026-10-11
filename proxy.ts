import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1] ?? "";
  const url = request.nextUrl.clone();

  if (segment === defaultLocale) {
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(segment)) return NextResponse.next();

  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|og|images|icon|apple-icon|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|llms\\.txt|.*\\..*).*)"],
};
