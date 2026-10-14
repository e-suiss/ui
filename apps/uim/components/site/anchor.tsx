"use client";

import Link from "next/link";
import type * as React from "react";

export function Anchor({ href = "#", ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("http") || href.startsWith("#")) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
