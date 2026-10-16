import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../lib/mobile/add.mjs"
import { choose, isInteractive } from "../lib/prompt.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

const MOBILE_REGISTRY = vi.hoisted(() => {
  const base = "https://registry.test/mobile"
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
  name: "esuiss-ui-mobile",
  homepage: "https://ui.suiss.app",
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
    {
      name: "date-picker",
      type: "pattern",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: ["text"],
      files: ["components/patterns/date-picker.tsx"],
    },
  ],
}

const files = {
  "registry.json": registry,
  "components/ui/text.tsx": "export function Text() {}\n",
  "uniwind/components/ui/button.tsx": "export function UniwindButton() {}\n",
  "stylesheet/components/ui/button.tsx":
    "export function StylesheetButton() {}\n",
  "components/patterns/date-picker.tsx": "export function DatePicker() {}\n",
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
  vi.mocked(choose).mockReset()
  vi.mocked(isInteractive).mockReturnValue(false)
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
    expect(fetch).toHaveBeenCalledWith(
      `${MOBILE_REGISTRY}/registry.json`,
      expect.anything()
    )
    expect(fetch).toHaveBeenCalledWith(
      `${MOBILE_REGISTRY}/uniwind/components/ui/button.tsx`,
      expect.anything()
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

  it("shows changed dependency files in the diff", async () => {
    serveRegistry(files)
    const cwd = expoProject(
      { uniwind: "1.0.0", "class-variance-authority": "0.7.1" },
      { "src/components/ui/text.tsx": "local\n" }
    )
    await add(["button"], { cwd, diff: true })
    expect(output()).toContain("- local")
    expect(read(cwd, "src/components/ui/text.tsx")).toBe("local\n")
  })

  it("adds only the components with --all", async () => {
    serveRegistry(files)
    const cwd = expoProject({
      uniwind: "1.0.0",
      "class-variance-authority": "0.7.1",
    })
    await add([], { cwd, all: true })
    expect(existsSync(path.join(cwd, "src/components/ui/button.tsx"))).toBe(
      true
    )
    expect(
      existsSync(path.join(cwd, "src/components/patterns/date-picker.tsx"))
    ).toBe(false)
  })

  it("adds every item of the group with --all", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0" })
    await add([], { cwd, all: true, scope: "pattern" })
    expect(
      existsSync(path.join(cwd, "src/components/patterns/date-picker.tsx"))
    ).toBe(true)
    expect(existsSync(path.join(cwd, "src/components/ui/button.tsx"))).toBe(
      false
    )
  })

  it("points to the group command for an item of another group", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0" })
    await expect(add(["date-picker"], { cwd })).rejects.toThrow(
      '"date-picker" is a pattern. Run npx @esuiss/ui add patterns date-picker'
    )
  })

  it("skips the group question when the group is given", async () => {
    serveRegistry(files)
    const cwd = expoProject({ uniwind: "1.0.0" })
    vi.mocked(isInteractive).mockReturnValue(true)
    vi.mocked(choose).mockResolvedValueOnce(["date-picker"])
    await add([], { cwd, scope: "pattern" })
    expect(choose).toHaveBeenCalledTimes(1)
    expect(vi.mocked(choose).mock.calls[0][1]).toEqual([
      { value: "date-picker", label: "date-picker" },
    ])
  })

  it("refuses registry files that point outside the project", async () => {
    serveRegistry({
      ...files,
      "registry.json": {
        ...registry,
        items: [
          {
            name: "escape",
            type: "ui",
            dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
            requires: [],
            files: ["../../escape.tsx"],
          },
        ],
      },
      "../../escape.tsx": "export {}\n",
    })
    const cwd = expoProject({ uniwind: "1.0.0" })
    await expect(add(["escape"], { cwd })).rejects.toThrow(
      "Refusing to write ../../escape.tsx outside the project."
    )
  })
})
