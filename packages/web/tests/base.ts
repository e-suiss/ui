import { inject } from "vitest"

declare module "vitest" {
  interface ProvidedContext {
    base: "base" | "radix"
  }
}

export const base = inject("base")

export function byBase<T>(values: { base: T; radix: T }) {
  return values[base]
}
