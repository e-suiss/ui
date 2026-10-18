import { readFile } from "node:fs/promises"
import path from "node:path"
import type { ThemeDefaults } from "@/lib/create/options"

const stylesheet = path.join(
  process.cwd(),
  "../../packages/web/styles/globals.css"
)

const DECLARATION = /--([\w-]+):\s*([^;]+);/g

function variablesIn(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return {}
  const body = css.slice(start, css.indexOf("}", start))
  return Object.fromEntries(
    [...body.matchAll(DECLARATION)].map(([, name, value]) => [
      name,
      value?.trim(),
    ])
  ) as Record<string, string>
}

export async function themeDefaults(): Promise<ThemeDefaults> {
  const css = await readFile(stylesheet, "utf8")
  return { light: variablesIn(css, ":root"), dark: variablesIn(css, ".dark") }
}
