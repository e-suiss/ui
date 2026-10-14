import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../lib/mobile/add.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

const MOBILE_REGISTRY = vi.hoisted(() => {
  const base = "https://registry.test/uim"
  process.env.ESUISS_MOBILE_REGISTRY = `${base}/`
  return base
})

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

vi.mock("../lib/prompt.mjs", () => ({
  isInteractive: vi.fn(() => false),
  choose: vi.fn(),
}))

const registry = {
  name: "esuiss-uim",
  homepage: "https://github.com/e-suiss/uim",
  styles: {
    uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
    nativewind: {
      stylesheet: "styles/nativewind.css",
      config: "styles/nativewind.config.js",
      directory: "nativewind",
    },
    stylesheet: {
      theme: "stylesheet/components/ui/theme.ts",
      directory: "stylesheet",
    },
  },
  platforms: {},
  items: [
    {
      name: "text",
      type: "ui",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: [],
      files: ["components/ui/text.tsx"],
    },
    {
      name: "button",
      type: "ui",
      dependencies: {
        uniwind: ["class-variance-authority"],
        nativewind: ["class-variance-authority"],
        stylesheet: ["react-native-svg"],
      },
      requires: ["text"],
      files: ["components/ui/button.tsx"],
      overrides: ["uniwind", "nativewind", "stylesheet"],
    },
  ],
}

const files = {
  "registry.json": registry,
  "components/ui/text.tsx": "export function Text() {}\n",
  "uniwind/components/ui/button.tsx": "export function UniwindButton() {}\n",
  "stylesheet/components/ui/button.tsx":
    "export function StylesheetButton() {}\n",
}

function expoProject(packages = {}, extra = {}) {
  return createProject({
    "package.json": {
      dependencies: { expo: "55.0.0", "react-native": "0.83.0", ...packages },
    },
    "tsconfig.json": {
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    },
    ...extra,
  })
}

let output

beforeEach(() => {
  output = silenceOutput()
  vi.mocked(spawnSync).mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("mobile add", () => {
  it("downloads from the registry set in ESUISS_MOBILE_REGISTRY", async () => {
    const fetch = serveRegistry(files)
    const cwd = expoProject({
      uniwind: "1.0.0",
      "class-variance-authority": "0.7.1",
    })
    await add(["button"], { cwd })
    expect(fetch).toHaveBeenCalledWith(`${MOBILE_REGISTRY}/registry.json`)
    expect(fetch).toHaveBeenCalledWith(
      `${MOBILE_REGISTRY}/uniwind/components/ui/button.tsx`
    )
  })

  it("writes the styling override and the required items", async () => {
    serveRegistry(files)
    const cwd = expoProject({
      uniwind: "1.0.0",
      "class-variance-authority": "0.7.1",
    })
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["uniwind/components/ui/button.tsx"]
    )
    expect(read(cwd, "src/components/ui/text.tsx")).toBe(
      files["components/ui/text.tsx"]
    )
    expect(output()).toContain("Created 2 files")
    expect(spawnSync).not.toHaveBeenCalled()
  })

  it("installs the packages of the detected styling with expo install", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0" })
    await add(["button"], { cwd })
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "class-variance-authority"],
      expect.objectContaining({ cwd })
    )
    expect(output()).toContain("Installed class-variance-authority")
  })

  it("uses StyleSheet when the theme file exists", async () => {
    serveRegistry(files)
    const cwd = expoProject(
      { "react-native-svg": "15.0.0" },
      { "src/components/ui/theme.ts": "export const theme = {}\n" }
    )
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["stylesheet/components/ui/button.tsx"]
    )
  })

  it("follows --styling over the installed packages", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0", "react-native-svg": "15.0.0" })
    await add(["button"], { cwd, styling: "stylesheet" })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["stylesheet/components/ui/button.tsx"]
    )
  })

  it("asks for init when no styling is set up", async () => {
    serveRegistry(files)
    const cwd = expoProject()
    await expect(add(["button"], { cwd })).rejects.toThrow(
      "No styling setup found. Run `npx @esuiss/ui init` first."
    )
    expect(existsSync(path.join(cwd, "src"))).toBe(false)
  })

  it("rejects an unknown component", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0" })
    await expect(add(["sidebar"], { cwd })).rejects.toThrow(
      "Unknown component: sidebar."
    )
  })

  it("keeps local files that differ from the registry", async () => {
    serveRegistry(files)
    const cwd = expoProject(
      { uniwind: "1.0.0", "class-variance-authority": "0.7.1" },
      { "src/components/ui/text.tsx": "local\n" }
    )
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/text.tsx")).toBe("local\n")
    expect(output()).toContain("Kept 1 local file that differs")
  })
})
