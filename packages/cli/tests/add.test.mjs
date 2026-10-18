import { spawnSync } from "node:child_process"
import { existsSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../lib/add.mjs"
import { CliError } from "../lib/output.mjs"
import { choose, isInteractive } from "../lib/prompt.mjs"
import { read, serveRegistry, silenceOutput, viteProject } from "./helpers.mjs"

const RADIX_INDEX = /\/registry\/radix\/registry\.json$/
const ARIA_INDEX = /\/registry\/aria\/registry\.json$/

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

vi.mock("../lib/prompt.mjs", () => ({
  isInteractive: vi.fn(() => false),
  choose: vi.fn(),
}))

const ui = (name, extra = {}) => ({
  name,
  type: "registry:ui",
  files: [{ path: `components/ui/${name}.tsx`, type: "registry:ui" }],
  ...extra,
})

const registry = {
  name: "esuiss",
  homepage: "https://suiss.app/ui",
  items: [
    ui("button", { dependencies: ["@base-ui/react"] }),
    ui("dialog", {
      dependencies: ["@base-ui/react"],
      registryDependencies: ["@esuiss/button"],
    }),
    ui("theme", {
      css: {
        "@keyframes theme-reveal": { to: { opacity: "1" } },
        "html::view-transition-old(root)": { animation: "none" },
      },
      meta: { optIn: true },
    }),
    {
      name: "date-picker",
      type: "registry:component",
      dependencies: ["react-day-picker"],
      registryDependencies: ["@esuiss/dialog"],
      files: [
        {
          path: "components/patterns/date-picker.tsx",
          type: "registry:component",
          target: "@components/patterns/date-picker.tsx",
        },
      ],
    },
    {
      name: "theme-suiss",
      type: "registry:theme",
      cssVars: { light: { primary: "oklch(0.5 0.2 256)" } },
    },
  ],
}

const themeCss = `@keyframes theme-reveal {
  to {
    opacity: 1;
  }
}

html::view-transition-old(root) {
  animation: none;
}`

const files = {
  "registry/registry.json": registry,
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
  vi.mocked(choose).mockReset()
  vi.mocked(isInteractive).mockReturnValue(false)
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
      ["install", "--", "@base-ui/react"],
      expect.objectContaining({ cwd })
    )
  })

  it("installs icon placeholders as Phosphor icons", async () => {
    serveRegistry({
      ...files,
      "registry/registry.json": {
        ...registry,
        items: [
          ...registry.items,
          ui("accordion", { dependencies: ["@base-ui/react"] }),
        ],
      },
      "components/ui/accordion.tsx": `import { Accordion } from "@base-ui/react/accordion"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const Icon = () => (
  <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" />
)
`,
    })
    const cwd = viteProject()
    await add(["accordion"], { cwd })
    expect(read(cwd, "src/components/ui/accordion.tsx")).toBe(
      `import { Accordion } from "@base-ui/react/accordion"
import { CaretDownIcon } from "@phosphor-icons/react"

export const Icon = () => (
  <CaretDownIcon />
)
`
    )
    expect(spawnSync).toHaveBeenCalledWith(
      "npm",
      ["install", "--", "@base-ui/react", "@phosphor-icons/react"],
      expect.objectContaining({ cwd })
    )
  })

  describe("with the second primitive base", () => {
    const radix = {
      "bases/radix/components/ui/dialog.tsx":
        'import { Dialog } from "radix-ui"\n',
      "registry/radix/registry.json": {
        ...registry,
        items: registry.items.map((item) =>
          item.name === "dialog"
            ? {
                ...item,
                dependencies: ["radix-ui"],
                files: [
                  {
                    path: "bases/radix/components/ui/dialog.tsx",
                    type: "registry:ui",
                  },
                ],
              }
            : item
        ),
      },
      ...files,
    }

    it("installs the twin into the usual folder", async () => {
      serveRegistry(radix)
      const cwd = viteProject()
      await add(["dialog"], { cwd, base: "radix" })
      expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
        radix["bases/radix/components/ui/dialog.tsx"]
      )
      expect(read(cwd, "src/components/ui/button.tsx")).toBe(
        files["components/ui/button.tsx"]
      )
      expect(spawnSync).toHaveBeenCalledWith(
        "npm",
        ["install", "--", "@base-ui/react", "radix-ui"],
        expect.objectContaining({ cwd })
      )
    })

    it("follows the style in components.json", async () => {
      const fetch = serveRegistry(radix)
      const cwd = viteProject({ "components.json": { style: "radix-nova" } })
      await add(["dialog"], { cwd })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(RADIX_INDEX),
        expect.anything()
      )
      expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
        radix["bases/radix/components/ui/dialog.tsx"]
      )
    })

    it("lets --base override the style in components.json", async () => {
      serveRegistry(radix)
      const cwd = viteProject({ "components.json": { style: "radix-nova" } })
      await add(["dialog"], { cwd, base: "base" })
      expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
        files["components/ui/dialog.tsx"]
      )
    })
  })

  describe("with the third primitive base", () => {
    const aria = {
      "bases/aria/components/ui/dialog.tsx":
        'import { Modal } from "react-aria-components"\n',
      "registry/aria/registry.json": {
        ...registry,
        items: registry.items.map((item) =>
          item.name === "dialog"
            ? {
                ...item,
                dependencies: ["react-aria-components"],
                files: [
                  {
                    path: "bases/aria/components/ui/dialog.tsx",
                    type: "registry:ui",
                  },
                ],
              }
            : item
        ),
      },
      ...files,
    }

    it("installs the twin into the usual folder", async () => {
      serveRegistry(aria)
      const cwd = viteProject()
      await add(["dialog"], { cwd, base: "aria" })
      expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
        aria["bases/aria/components/ui/dialog.tsx"]
      )
      expect(spawnSync).toHaveBeenCalledWith(
        "npm",
        ["install", "--", "@base-ui/react", "react-aria-components"],
        expect.objectContaining({ cwd })
      )
    })

    it("follows the style in components.json", async () => {
      const fetch = serveRegistry(aria)
      const cwd = viteProject({ "components.json": { style: "aria-nova" } })
      await add(["dialog"], { cwd })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(ARIA_INDEX),
        expect.anything()
      )
      expect(read(cwd, "src/components/ui/dialog.tsx")).toBe(
        aria["bases/aria/components/ui/dialog.tsx"]
      )
    })
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

  it("adds the styles an item needs to the stylesheet once", async () => {
    const cwd = viteProject({ "src/index.css": '@import "tailwindcss";\n' })
    await add(["theme"], { cwd })
    await add(["theme"], { cwd, overwrite: true })
    expect(read(cwd, "src/index.css")).toBe(
      `@import "tailwindcss";\n\n${themeCss}\n`
    )
    expect(output()).toContain("Added the styles for theme to src/index.css")
  })

  it("uses the stylesheet named in components.json", async () => {
    const cwd = viteProject({
      "components.json": { tailwind: { css: "src/styles/app.css" } },
      "src/styles/app.css": '@import "tailwindcss";\n',
    })
    await add(["theme"], { cwd })
    expect(read(cwd, "src/styles/app.css")).toContain("@keyframes theme-reveal")
  })

  it("explains where the styles go when there is no stylesheet", async () => {
    const cwd = viteProject()
    await add(["theme"], { cwd })
    expect(existsSync(path.join(cwd, "src/index.css"))).toBe(false)
    expect(output()).toContain(
      `Add the styles for theme to your stylesheet:\n\n${themeCss}`
    )
  })

  it("leaves the stylesheet alone for items without styles", async () => {
    const cwd = viteProject({ "src/index.css": '@import "tailwindcss";\n' })
    await add(["dialog"], { cwd })
    expect(read(cwd, "src/index.css")).toBe('@import "tailwindcss";\n')
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
      "Unknown component: buton.\nAvailable: button, dialog"
    )
  })

  it("asks for at least one name and lists the choices outside a terminal", async () => {
    const cwd = viteProject()
    await expect(add([], { cwd, scope: "ui" })).rejects.toThrow(
      "Name at least one component, e.g. npx @esuiss/ui add button\nAvailable: button, dialog"
    )
    expect(choose).not.toHaveBeenCalled()
  })

  it("lets the user pick the group and the items in a terminal", async () => {
    const cwd = viteProject()
    vi.mocked(isInteractive).mockReturnValue(true)
    vi.mocked(choose)
      .mockResolvedValueOnce("pattern")
      .mockResolvedValueOnce(["date-picker"])
    await add([], { cwd })
    expect(vi.mocked(choose).mock.calls[0][1]).toEqual([
      { value: "ui", label: "Components", hint: "3" },
      { value: "pattern", label: "Patterns", hint: "1" },
    ])
    expect(vi.mocked(choose).mock.calls[1][1]).toEqual([
      { value: "date-picker", label: "date-picker" },
    ])
    expect(
      existsSync(path.join(cwd, "src/components/patterns/date-picker.tsx"))
    ).toBe(true)
    expect(existsSync(path.join(cwd, "src/components/ui/dialog.tsx"))).toBe(
      true
    )
  })

  it("skips the group question when the group is given", async () => {
    const cwd = viteProject()
    vi.mocked(isInteractive).mockReturnValue(true)
    vi.mocked(choose).mockResolvedValueOnce(["button"])
    await add([], { cwd, scope: "ui" })
    expect(choose).toHaveBeenCalledTimes(1)
    expect(vi.mocked(choose).mock.calls[0][2]).toEqual({ multiple: true })
    expect(existsSync(path.join(cwd, "src/components/ui/button.tsx"))).toBe(
      true
    )
  })

  it("does not prompt when names are given", async () => {
    const cwd = viteProject()
    vi.mocked(isInteractive).mockReturnValue(true)
    await add(["button"], { cwd })
    expect(choose).not.toHaveBeenCalled()
  })

  it("writes nothing when the picker is cancelled", async () => {
    const cwd = viteProject()
    vi.mocked(isInteractive).mockReturnValue(true)
    vi.mocked(choose).mockRejectedValueOnce(new CliError("Cancelled."))
    await expect(add([], { cwd })).rejects.toThrow("Cancelled.")
    expect(existsSync(path.join(cwd, "src/components"))).toBe(false)
  })

  it("requires the @/* alias", async () => {
    const cwd = viteProject()
    writeFileSync(path.join(cwd, "tsconfig.json"), "{}")
    await expect(add(["button"], { cwd })).rejects.toThrow(CliError)
  })

  it("refuses registry files that point outside the project", async () => {
    const cwd = viteProject()
    serveRegistry({
      "registry/registry.json": {
        ...registry,
        items: [
          {
            name: "escape",
            type: "registry:ui",
            files: [{ path: "../../escape.tsx", type: "registry:ui" }],
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

  it("shows changed dependency files in the diff that --overwrite replaces", async () => {
    const cwd = viteProject({
      "src/components/ui/button.tsx": "export function Button() { edited }\n",
    })
    await add(["dialog"], { cwd, diff: true })
    expect(output()).toContain("- export function Button() { edited }")
    expect(read(cwd, "src/components/ui/button.tsx")).toContain("edited")

    await add(["dialog"], { cwd, overwrite: true })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["components/ui/button.tsx"]
    )
  })

  it("does not open the pick list with --yes", async () => {
    const cwd = viteProject()
    vi.mocked(isInteractive).mockReturnValue(true)
    await expect(add([], { cwd, yes: true })).rejects.toThrow(
      "Name at least one component"
    )
    expect(choose).not.toHaveBeenCalled()
  })

  it("does not add styles the stylesheet already has in another format", async () => {
    const current =
      "@import 'tailwindcss';\n@keyframes   theme-reveal{to{opacity:0.5}}\nhtml::view-transition-old(root){animation:none}\n"
    const cwd = viteProject({ "src/index.css": current })
    await add(["theme"], { cwd })
    expect(read(cwd, "src/index.css")).toBe(current)
  })

  it("explains a dependency that is missing from the registry", async () => {
    const cwd = viteProject()
    serveRegistry({
      ...files,
      "registry/registry.json": {
        ...registry,
        items: [ui("menu", { registryDependencies: ["@esuiss/popup"] })],
      },
    })
    await expect(add(["menu"], { cwd })).rejects.toThrow(
      "menu needs popup, which is not in the registry."
    )
  })

  describe("styles", () => {
    const styles = {
      known: ["cn-button-variant-default"],
      suiss: { "cn-button": "rounded-full px-4" },
      overrides: { radix: { "cn-button": "rounded-full px-5" } },
      vendors: { vega: { "cn-button": "rounded-md px-2.5" } },
    }
    const marked = {
      ...files,
      "registry/styles.json": styles,
      "components/ui/button.tsx":
        'export const button = "cn-button inline-flex cn-button-variant-default"\n',
    }

    it("expands markers into the suiss style by default", async () => {
      serveRegistry(marked)
      const cwd = viteProject()
      await add(["button"], { cwd })
      expect(read(cwd, "src/components/ui/button.tsx")).toBe(
        'export const button = "rounded-full px-4 inline-flex"\n'
      )
    })

    it("uses the style passed with --style", async () => {
      serveRegistry(marked)
      const cwd = viteProject()
      await add(["button"], { cwd, style: "vega" })
      expect(read(cwd, "src/components/ui/button.tsx")).toBe(
        'export const button = "rounded-md px-2.5 inline-flex"\n'
      )
    })

    it("reads the style and base from components.json", async () => {
      serveRegistry({ ...marked, "registry/radix/registry.json": registry })
      const cwd = viteProject({
        "components.json": { style: "radix-nova" },
      })
      await add(["button"], { cwd })
      expect(read(cwd, "src/components/ui/button.tsx")).toBe(
        'export const button = "rounded-full px-5 inline-flex"\n'
      )
    })

    it("falls back to suiss for an unknown style in components.json", async () => {
      serveRegistry(marked)
      const cwd = viteProject({ "components.json": { style: "base-plain" } })
      await add(["button"], { cwd })
      expect(read(cwd, "src/components/ui/button.tsx")).toBe(
        'export const button = "rounded-full px-4 inline-flex"\n'
      )
    })

    it("does not download styles for files without markers", async () => {
      const fetch = serveRegistry(files)
      const cwd = viteProject()
      await add(["button"], { cwd })
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining("styles.json"),
        expect.anything()
      )
    })
  })

  describe("components.json", () => {
    it("applies the saved icon library and menu color", async () => {
      serveRegistry({
        ...files,
        "components/ui/button.tsx": `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export const menu = "cn-menu-target cn-menu-translucent z-50 cn-font-heading"
export const Icon = () => <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
`,
      })
      const cwd = viteProject({
        "components.json": { iconLibrary: "lucide", menuColor: "inverted" },
      })
      await add(["button"], { cwd })
      const button = read(cwd, "src/components/ui/button.tsx")
      expect(button).toContain('export const menu = "dark z-50"')
      expect(button).toContain('from "lucide-react"')
      expect(spawnSync).toHaveBeenCalledWith(
        "npm",
        ["install", "--", "@base-ui/react", "lucide-react"],
        expect.objectContaining({ cwd })
      )
    })
  })
})
