import { inject } from "vitest"

type Base = "base" | "radix" | "aria"

declare module "vitest" {
  interface ProvidedContext {
    base: Base
  }
}

export const base = inject("base")

export function byBase<T>(values: Record<Base, T>) {
  return values[base]
}
