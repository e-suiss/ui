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

const PREVIEW_PATH = /^\/preview\/([^/]+)$/

const framedPreviews = new Set(
  (process.env.FRAMED_PREVIEWS ?? "").split(",").filter(Boolean)
)

function known(pathname: string) {
  const preview = pathname.match(PREVIEW_PATH)?.[1]
  if (preview !== undefined) return framedPreviews.has(preview)
  const slug = slugOf(pathname)
  return Boolean(slug && source.getPage(slug))
}

export function proxy(request: NextRequest) {
  if (known(request.nextUrl.pathname)) return NextResponse.next()
  return NextResponse.rewrite(new URL("/_not-found", request.url))
}

export const config = {
  matcher: ["/docs/:path+", "/preview/:path+"],
}
