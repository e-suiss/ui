import { spawnSync } from "node:child_process"
import { existsSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../../packages/cli/lib/add.mjs"
import { CliError } from "../../packages/cli/lib/output.mjs"
import { read, serveRegistry, silenceOutput, viteProject } from "./helpers.mjs"

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const registry = {
  stylesheet: "styles/globals.css",
  items: [
    {
      name: "button",
      type: "ui",
      requires: [],
      dependencies: ["@base-ui/react"],
      files: ["components/ui/button.tsx"],
    },
    {
      name: "dialog",
      type: "ui",
      requires: ["button"],
      dependencies: ["@base-ui/react"],
      files: ["components/ui/dialog.tsx"],
    },
    {
      name: "theme",
      type: "ui",
      optIn: true,
      requires: [],
      dependencies: [],
      files: ["components/ui/theme.tsx"],
    },
    {
      name: "date-picker",
      type: "pattern",
      requires: ["dialog"],
      dependencies: ["react-day-picker"],
      files: ["components/patterns/date-picker.tsx"],
    },
  ],
}

const files = {
  "registry.json": registry,
  "components/ui/button.tsx": "export function Button() {}\n",
  "components/ui/dialog.tsx": "export function Dialog() {}\n",
  "components/ui/theme.tsx": "export function Theme() {}\n",
  "components/patterns/date-picker.tsx": "export function DatePicker() {}\n",
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

describe("add", () => {
  it("writes the item and its dependencies under the alias root", async () => {
    const cwd = viteProject()
    await add(["dialog"], { cwd })
    expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
      files["components/ui/dialog.tsx"]
    )
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["components/ui/button.tsx"]
    )
    expect(output()).toContain("Created 2 files")
  })

  it("installs the npm packages the items need", async () => {
    const cwd = viteProject()
    await add(["dialog"], { cwd })
    expect(spawnSync).toHaveBeenCalledWith(
      "npm",
      ["install", "@base-ui/react"],
      expect.objectContaining({ cwd })
    )
  })

  it("keeps local edits unless asked to overwrite", async () => {
    const cwd = viteProject({
      "src/components/ui/button.tsx": "export function Button() { edited }\n",
    })
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/button.tsx")).toContain("edited")
    expect(output()).toContain("Kept 1 local file that differs")

    await add(["button"], { cwd, overwrite: true })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["components/ui/button.tsx"]
    )
  })

  it("reports when everything is already up to date", async () => {
    const cwd = viteProject()
    await add(["button"], { cwd })
    await add(["button"], { cwd })
    expect(output()).toContain("Already up to date.")
  })

  it("shows a diff without writing files", async () => {
    const cwd = viteProject({
      "src/components/ui/button.tsx": "export function Button() { edited }\n",
    })
    await add(["button", "dialog"], { cwd, diff: true })
    const printed = output()
    expect(printed).toContain("- export function Button() { edited }")
    expect(printed).toContain("+ export function Button() {}")
    expect(printed).toContain(
      `${path.join("src", "components", "ui", "dialog.tsx")} is not installed.`
    )
    expect(existsSync(path.join(cwd, "src/components/ui/dialog.tsx"))).toBe(
      false
    )
  })

  it("adds every item of a scope except opt-in ones with --all", async () => {
    const cwd = viteProject()
    await add([], { cwd, all: true, scope: "ui" })
    expect(existsSync(path.join(cwd, "src/components/ui/dialog.tsx"))).toBe(
      true
    )
    expect(existsSync(path.join(cwd, "src/components/ui/theme.tsx"))).toBe(
      false
    )
  })

  it("adds patterns from the pattern scope", async () => {
    const cwd = viteProject()
    await add(["date-picker"], { cwd, scope: "pattern" })
    expect(
      existsSync(path.join(cwd, "src/components/patterns/date-picker.tsx"))
    ).toBe(true)
  })

  it("points to the right command when an item is in another scope", async () => {
    const cwd = viteProject()
    await expect(add(["date-picker"], { cwd, scope: "ui" })).rejects.toThrow(
      '"date-picker" is a pattern. Run npx @esuiss/ui add patterns date-picker'
    )
  })

  it("lists the available items for an unknown name", async () => {
    const cwd = viteProject()
    await expect(add(["buton"], { cwd, scope: "ui" })).rejects.toThrow(
      "Unknown component: buton.\nAvailable: button, dialog, theme"
    )
  })

  it("asks for at least one name", async () => {
    const cwd = viteProject()
    await expect(add([], { cwd, scope: "ui" })).rejects.toThrow(
      "Name at least one component, e.g. npx @esuiss/ui add button"
    )
  })

  it("requires the @/* alias", async () => {
    const cwd = viteProject()
    writeFileSync(path.join(cwd, "tsconfig.json"), "{}")
    await expect(add(["button"], { cwd })).rejects.toThrow(CliError)
  })

  it("refuses registry files that point outside the project", async () => {
    const cwd = viteProject()
    serveRegistry({
      "registry.json": {
        ...registry,
        items: [
          {
            name: "escape",
            type: "ui",
            requires: [],
            dependencies: [],
            files: ["../../escape.tsx"],
          },
        ],
      },
      "../../escape.tsx": "export {}\n",
    })
    await expect(add(["escape"], { cwd })).rejects.toThrow(
      "Refusing to write ../../escape.tsx outside the project."
    )
    expect(existsSync(path.join(cwd, "escape.tsx"))).toBe(false)
  })
})
