import { spawnSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { apply } from "../lib/apply.mjs"
import { init, POINTER_CSS } from "../lib/init.mjs"
import { read, serveRegistry, silenceOutput, viteProject } from "./helpers.mjs"

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const stylesheet = `@import "tailwindcss";

:root {
  --radius: 0.625rem;
  --primary: oklch(0.56 0.19 256);
  --background: oklch(1 0 0);
}

.dark {
  --primary: oklch(0.6 0.19 256);
  --background: oklch(0 0 0);
}
`

const themes = [
  {
    name: "stone",
    light: { background: "oklch(1 0 0 / 1)", primary: "oklch(0.2 0 0)" },
    dark: { background: "oklch(0.1 0 0)", primary: "oklch(0.9 0 0)" },
  },
  {
    name: "emerald",
    light: { primary: "oklch(0.6 0.13 163)" },
    dark: { primary: "oklch(0.7 0.15 162)" },
  },
]

const files = {
  "registry/registry.json": {
    name: "esuiss",
    homepage: "https://suiss.app/ui",
    items: [
      {
        name: "button",
        type: "registry:ui",
        dependencies: ["@base-ui/react"],
        files: [{ path: "components/ui/button.tsx", type: "registry:ui" }],
      },
      {
        name: "card",
        type: "registry:ui",
        dependencies: [],
        files: [{ path: "components/ui/card.tsx", type: "registry:ui" }],
      },
    ],
  },
  "registry/themes.json": themes,
  "styles/globals.css": stylesheet,
  "components/ui/button.tsx": "export function Button() {}\n",
  "components/ui/card.tsx": "export function Card() {}\n",
}

const viteConfig = `import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
})
`

let output

beforeEach(() => {
  serveRegistry(files)
  output = silenceOutput()
  vi.mocked(spawnSync).mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function initialized() {
  const cwd = viteProject({ "vite.config.ts": viteConfig })
  await init({ cwd, yes: true })
  return cwd
}

describe("init --pointer and --rtl", () => {
  it("adds the pointer cursor rule with --pointer", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, pointer: true })
    expect(read(cwd, "src/index.css")).toContain(POINTER_CSS.trim())
  })

  it("leaves the cursor alone without --pointer", async () => {
    const cwd = await initialized()
    expect(read(cwd, "src/index.css")).not.toContain("cursor: pointer")
  })

  it("notes how to go right to left with --rtl", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, rtl: true })
    expect(output()).toContain('dir="rtl"')
  })
})

describe("apply", () => {
  it("needs an initialized project", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await expect(apply({ cwd, preset: "bJ4oV1t" })).rejects.toThrow(
      "Run `npx @esuiss/ui init` first."
    )
  })

  it("applies the colors, radius and style of a preset", async () => {
    const cwd = await initialized()
    await apply({ cwd, yes: true, preset: "bJ4oV1t" })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--radius: 0;")
    expect(css).toContain("--primary: oklch(0.6 0.13 163);")
    expect(css).toContain("--primary: oklch(0.7 0.15 162);")
    expect(JSON.parse(read(cwd, "components.json"))).toMatchObject({
      style: "base-vega",
      iconLibrary: "lucide",
      menuColor: "inverted",
    })
  })

  it("restyles the installed components and skips the rest", async () => {
    const cwd = await initialized()
    writeFileSync(path.join(cwd, "src/components/ui/button.tsx"), "changed\n")
    await apply({ cwd, yes: true, preset: "bJ4oV1t" })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      "export function Button() {}\n"
    )
    expect(() => read(cwd, "src/components/ui/card.tsx")).toThrow()
  })

  it("changes only the theme with --only theme", async () => {
    const cwd = await initialized()
    const config = read(cwd, "components.json")
    writeFileSync(path.join(cwd, "src/components/ui/button.tsx"), "changed\n")
    await apply({ cwd, only: "theme", preset: "bJ4oV1t" })
    expect(read(cwd, "src/index.css")).toContain(
      "--primary: oklch(0.6 0.13 163);"
    )
    expect(read(cwd, "src/components/ui/button.tsx")).toBe("changed\n")
    expect(read(cwd, "components.json")).toBe(config)
  })

  it("leaves the colors alone with --only font", async () => {
    const cwd = await initialized()
    const before = read(cwd, "src/index.css")
    const config = read(cwd, "components.json")
    await apply({ cwd, only: "font", preset: "bJ4oV1t" })
    expect(read(cwd, "src/index.css")).toBe(before)
    expect(read(cwd, "components.json")).toBe(config)
    expect(output()).toContain("src/index.css already matches")
    expect(output()).not.toContain("Updated src/index.css")
  })

  it("sets a custom primary on its own", async () => {
    const cwd = await initialized()
    await apply({ cwd, primary: "oklch(0.7 0.15 162)" })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--primary: oklch(0.7 0.15 162);")
    expect(css).toContain("--radius: 0.625rem;")
  })

  it("adds the pointer rule once", async () => {
    const cwd = await initialized()
    await apply({ cwd, pointer: true })
    await apply({ cwd, pointer: true })
    const css = read(cwd, "src/index.css")
    expect(css.split("cursor: pointer").length).toBe(2)
  })
})
