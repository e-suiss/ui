"use client"

import Link from "next/link"
import type * as React from "react"

const UI_ZONE = /^\/ui(?:\/|$)/

export function Anchor({ href = "#", ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("http") || href.startsWith("#") || UI_ZONE.test(href)) {
    return <a href={href} {...props} />
  }
  return <Link href={href} {...props} />
}
