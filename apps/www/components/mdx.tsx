import type { MDXComponents } from "mdx/types"
import { Anchor } from "@/components/anchor"

export function getMDXComponents(): MDXComponents {
  return {
    a: ({ href = "#", ...props }) => <Anchor href={href} {...props} />,
  }
}
