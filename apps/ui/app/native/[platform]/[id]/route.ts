import { notFound } from "next/navigation"

import { highlightCode } from "@/lib/highlight"
import { NATIVE_LANGUAGES, nativeCode, nativeNames } from "@/lib/native"

export async function GET(
  _request: Request,
  context: RouteContext<"/native/[platform]/[id]">
) {
  const { platform, id } = await context.params
  const lang = NATIVE_LANGUAGES[platform as keyof typeof NATIVE_LANGUAGES]
  const code = lang && nativeCode(id)[platform as keyof typeof NATIVE_LANGUAGES]
  if (!(lang && code)) notFound()
  const raw = code.trimEnd()
  return Response.json({ ...(await highlightCode(raw, lang)), raw })
}

export function generateStaticParams() {
  return nativeNames().flatMap((id) =>
    Object.keys(NATIVE_LANGUAGES)
      .filter(
        (platform) => nativeCode(id)[platform as keyof typeof NATIVE_LANGUAGES]
      )
      .map((platform) => ({ platform, id }))
  )
}

export const dynamic = "force-static"
