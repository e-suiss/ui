import { spawnSync } from "node:child_process"
import { encodePreset } from "shadcn/preset"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { apply, init } from "../lib/mobile/init.mjs"
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
  "registry/themes.json": [],
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

  it("keeps the colors when only the style changes", async () => {
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      {
        "global.css": uniwind.replace(
          "oklch(0.56 0.19 256)",
          "oklch(0.7 0.15 162)"
        ),
      }
    )
    await apply({ cwd, style: "suiss" })
    expect(read(cwd, "global.css")).toContain(
      "--color-primary: oklch(0.7 0.15 162);"
    )
  })

  it("resets the fonts for a preset with the system font", async () => {
    const geist = `type Fonts = { sans?: string; heading?: string }

const fonts: Fonts = { sans: "Geist" }
`
    const cwd = expoProject(
      { uniwind: "1.0.0", "@expo-google-fonts/geist": "0.4.0" },
      {
        "global.css": uniwind,
        "components/primitives/font.ts": geist,
        "app.json": {
          expo: {
            plugins: [
              "expo-router",
              [
                "expo-font",
                {
                  ios: {
                    fonts: [
                      "./node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf",
                    ],
                  },
                },
              ],
            ],
          },
        },
      }
    )
    await apply({ cwd, preset: encodePreset({ font: "inter" }) })
    expect(read(cwd, "components/primitives/font.ts")).toContain(
      "const fonts: Fonts = {}"
    )
    expect(JSON.parse(read(cwd, "app.json")).expo.plugins).toEqual([
      "expo-router",
    ])
    expect(output()).toContain("@expo-google-fonts/geist is no longer used")
    expect(output()).not.toContain("--overwrite")
  })

  it("installs Inter when the preset names it", async () => {
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": uniwind, "components/primitives/font.ts": "" }
    )
    await apply({
      cwd,
      preset: encodePreset({ font: "inter", fontHeading: "inter" }),
      only: "font",
    })
    expect(read(cwd, "components/primitives/font.ts")).toContain(
      'const fonts: Fonts = { sans: "Inter" }'
    )
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "expo-font", "@expo-google-fonts/inter"],
      expect.objectContaining({ cwd })
    )
  })
})

const INIT_ITEMS = [
  "button",
  "primitives/hooks",
  "primitives/portal",
  "primitives/toggle",
  "primitives/toggle-group",
].map((name) => ({
  name,
  type: "ui",
  dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
  requires: [],
  files: [],
}))

describe("React Native init again", () => {
  const theme = 'const light = {\n  primary: "#0071e3",\n}\n'

  beforeEach(() => {
    serveRegistry({
      ...files,
      "registry.json": { ...files["registry.json"], items: INIT_ITEMS },
      "stylesheet/components/ui/theme.ts": theme,
    })
  })

  it("keeps a changed StyleSheet theme without --yes", async () => {
    const cwd = expoProject({}, { "components/ui/theme.ts": "old\n" })
    await init({ cwd, styling: "stylesheet" })
    expect(read(cwd, "components/ui/theme.ts")).toBe("old\n")
    expect(output()).toContain("Kept components/ui/theme.ts")
  })

  it("replaces the StyleSheet theme with --yes like the CSS stylings", async () => {
    const cwd = expoProject({}, { "components/ui/theme.ts": "old\n" })
    await init({ cwd, styling: "stylesheet", yes: true })
    expect(read(cwd, "components/ui/theme.ts")).toBe(theme)
  })
})

describe("NativeWind apply", () => {
  it("asks before replacing the Tailwind config", async () => {
    serveRegistry({
      ...files,
      "registry.json": {
        ...files["registry.json"],
        styles: {
          ...files["registry.json"].styles,
          nativewind: {
            stylesheet: "styles/nativewind.css",
            config: "styles/nativewind.config.js",
            directory: "nativewind",
          },
        },
      },
      "styles/nativewind.css": ":root {\n  --primary: #0071e3;\n  }\n",
      "styles/nativewind.config.js": "module.exports = {}\n",
    })
    const cwd = expoProject(
      { nativewind: "4.2.0" },
      {
        "global.css": "old\n",
        "tailwind.config.js": "module.exports = { mine: true }\n",
      }
    )
    await apply({ cwd, primary: "#e11d48" })
    expect(read(cwd, "tailwind.config.js")).toBe(
      "module.exports = { mine: true }\n"
    )
    expect(output()).toContain("Kept tailwind.config.js")
    await apply({ cwd, primary: "#e11d48", yes: true })
    expect(read(cwd, "tailwind.config.js")).toBe("module.exports = {}\n")
  })
})
