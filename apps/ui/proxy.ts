import { type NextRequest, NextResponse } from "next/server"

import { source } from "@/lib/source"

const MARKDOWN_EXTENSION = /\.md$/

function slugOf(pathname: string) {
  try {
    return pathname
      .replace(MARKDOWN_EXTENSION, "")
      .split("/")
      .filter(Boolean)
      .slice(1)
      .map(decodeURIComponent)
  } catch {
    return undefined
  }
}

export function proxy(request: NextRequest) {
  const slug = slugOf(request.nextUrl.pathname)
  if (slug && source.getPage(slug)) return NextResponse.next()
  return NextResponse.rewrite(new URL("/_not-found", request.url))
}

export const config = {
  matcher: ["/docs/:path+"],
}
