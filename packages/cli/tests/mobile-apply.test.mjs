import { spawnSync } from "node:child_process"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { apply } from "../lib/mobile/init.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

vi.hoisted(() => {
  process.env.ESUISS_MOBILE_REGISTRY = "https://registry.test/mobile/"
})

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const uniwind = `@import "tailwindcss";

@theme {
  --radius-md: 0.5rem;
}

@variant light {
  --color-primary: oklch(0.56 0.19 256);
}

@variant dark {
  --color-primary: oklch(0.6 0.19 256);
}
`

const files = {
  "registry.json": {
    name: "esuiss-ui-mobile",
    homepage: "https://suiss.app/ui",
    styles: {
      uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
      stylesheet: {
        theme: "stylesheet/components/ui/theme.ts",
        directory: "stylesheet",
      },
    },
    platforms: {},
    items: [],
  },
  "styles/uniwind.css": uniwind,
}

function expoProject(packages, extra) {
  return createProject({
    "package.json": {
      dependencies: { expo: "55.0.0", "react-native": "0.83.0", ...packages },
    },
    "tsconfig.json": "{}",
    ...extra,
  })
}

beforeEach(() => {
  serveRegistry(files)
  silenceOutput()
  vi.mocked(spawnSync).mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("React Native apply", () => {
  it("needs the theme init writes", async () => {
    const cwd = expoProject({ uniwind: "1.0.0" })
    await expect(
      apply({ cwd, primary: "oklch(0.7 0.15 162)" })
    ).rejects.toThrow("Run npx @esuiss/ui init first.")
  })

  it("rewrites the Uniwind stylesheet with the new primary", async () => {
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": "old\n", "App.tsx": "" }
    )
    await apply({ cwd, primary: "oklch(0.7 0.15 162)" })
    const css = read(cwd, "global.css")
    expect(css).toContain("--color-primary: oklch(0.7 0.15 162);")
    expect(css).not.toContain("oklch(0.56 0.19 256)")
  })

  it("leaves the stylesheet alone with --only font", async () => {
    const cwd = expoProject({ uniwind: "1.0.0" }, { "global.css": "old\n" })
    await apply({ cwd, primary: "oklch(0.7 0.15 162)", only: "font" })
    expect(read(cwd, "global.css")).toBe("old\n")
  })

  it("rewrites the StyleSheet theme when no Tailwind styling is installed", async () => {
    serveRegistry({
      ...files,
      "stylesheet/components/ui/theme.ts": "export const theme = {}\n",
    })
    const cwd = expoProject(
      {},
      { "components/ui/theme.ts": "old\n", "App.tsx": "" }
    )
    await apply({ cwd, primary: "#e11d48" })
    expect(read(cwd, "components/ui/theme.ts")).toBe(
      "export const theme = {}\n"
    )
  })
})
