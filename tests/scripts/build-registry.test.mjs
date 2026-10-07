import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { createProject } from "../cli/helpers.mjs"

const script = new URL("../../scripts/build-registry.mjs", import.meta.url)
  .pathname
const repo = new URL("../..", import.meta.url).pathname

function build(cwd, ...args) {
  try {
    const stdout = execFileSync("node", [script, ...args], {
      cwd,
      encoding: "utf8",
      stdio: "pipe",
    })
    return { code: 0, stdout, stderr: "" }
  } catch (error) {
    return {
      code: error.status,
      stdout: String(error.stdout),
      stderr: String(error.stderr),
    }
  }
}

function registryOf(cwd) {
  return JSON.parse(readFileSync(path.join(cwd, "registry.json"), "utf8"))
}

function project(files) {
  return createProject({ "styles/globals.css": "", ...files })
}

const item = (cwd, name) =>
  registryOf(cwd).items.find((entry) => entry.name === name)

describe("build-registry", () => {
  it("lists every source file with its type, title and path", () => {
    const cwd = project({
      "components/ui/button.tsx": "export {}",
      "components/ui/alert-dialog.tsx": "export {}",
      "components/patterns/date-picker.tsx": "export {}",
      "components/interactions/swipe-actions.tsx": "export {}",
      "components/charts/bar-chart-active.tsx": "export {}",
      "components/blocks/login-account.tsx": "export {}",
      "hooks/use-mobile.ts": "export {}",
      "components/ui/notes.md": "",
      "components/ui/button.css": "",
    })
    const result = build(cwd)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("registry.json: 7 items")
    const registry = registryOf(cwd)
    expect(registry).toMatchObject({
      name: "esuiss-ui",
      stylesheet: "styles/globals.css",
    })
    expect(
      registry.items.map(({ name, type, title, files }) => [
        name,
        type,
        title,
        files,
      ])
    ).toEqual([
      [
        "alert-dialog",
        "ui",
        "Alert Dialog",
        ["components/ui/alert-dialog.tsx"],
      ],
      ["button", "ui", "Button", ["components/ui/button.tsx"]],
      [
        "date-picker",
        "pattern",
        "Date Picker",
        ["components/patterns/date-picker.tsx"],
      ],
      [
        "swipe-actions",
        "interaction",
        "Swipe Actions",
        ["components/interactions/swipe-actions.tsx"],
      ],
      [
        "bar-chart-active",
        "chart",
        "Bar Chart Active",
        ["components/charts/bar-chart-active.tsx"],
      ],
      [
        "login-account",
        "block",
        "Login Account",
        ["components/blocks/login-account.tsx"],
      ],
      ["use-mobile", "hook", "Use Mobile", ["hooks/use-mobile.ts"]],
    ])
  })

  it("collects npm packages from every kind of import", () => {
    const cwd = project({
      "components/ui/dialog.tsx": `import * as React from "react"
import { createPortal } from "react-dom"
import { Dialog } from "@base-ui/react/dialog"
import { mergeProps } from "@base-ui/react/merge-props"
import type { Icon } from "@phosphor-icons/react"
import {
  XIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import "input-otp/styles.css"
export { cva } from "class-variance-authority"
import { helper } from "./helper"
`,
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "dialog").dependencies).toEqual([
      "@base-ui/react",
      "@phosphor-icons/react",
      "class-variance-authority",
      "cn",
      "input-otp",
    ])
  })

  it("records the local items an item imports, but not itself", () => {
    const cwd = project({
      "components/ui/button.tsx": "export {}",
      "components/ui/dialog.tsx": `import { Button } from "@/components/ui/button"
import { thing } from "@/components/ui/dialog"
`,
      "components/patterns/confirm.tsx": `import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
`,
      "hooks/use-mobile.ts": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "dialog").requires).toEqual(["button"])
    expect(item(cwd, "confirm").requires).toEqual([
      "button",
      "dialog",
      "use-mobile",
    ])
    expect(item(cwd, "button").requires).toEqual([])
  })

  it("marks the theme as opt-in only", () => {
    const cwd = project({
      "components/ui/theme.tsx": "export {}",
      "components/ui/button.tsx": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "theme").optIn).toBe(true)
    expect(item(cwd, "button")).not.toHaveProperty("optIn")
  })

  it("rejects a local import outside the registry folders", () => {
    const cwd = project({
      "components/ui/button.tsx": 'import { cn } from "@/lib/utils"',
    })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      'components/ui/button.tsx: unsupported local import "@/lib/utils"'
    )
  })

  it("reports an item that requires one that does not exist", () => {
    const cwd = project({
      "components/ui/dialog.tsx":
        'import { Button } from "@/components/ui/button"',
    })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain('dialog requires missing item "button"')
  })

  it("reports the same name in two folders", () => {
    const cwd = project({
      "components/ui/stepper.tsx": "export {}",
      "components/interactions/stepper.tsx": "export {}",
    })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain('"stepper" is defined more than once')
  })

  it("requires the shared stylesheet", () => {
    const cwd = createProject({ "components/ui/button.tsx": "export {}" })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("missing styles/globals.css")
  })

  it("checks that registry.json is up to date without writing it", () => {
    const cwd = project({ "components/ui/button.tsx": "export {}" })
    expect(build(cwd, "--check").code).toBe(1)

    expect(build(cwd).code).toBe(0)
    const result = build(cwd, "--check")
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("registry.json is up to date: 1 items")

    writeFileSync(
      path.join(cwd, "components/ui/button.tsx"),
      'import { cn } from "cn"'
    )
    const stale = build(cwd, "--check")
    expect(stale.code).toBe(1)
    expect(stale.stderr).toContain(
      "registry.json is out of date. Run `pnpm registry`."
    )
    expect(item(cwd, "button").dependencies).toEqual([])
  })
})

describe("the published registry", () => {
  const registry = registryOf(repo)
  const manifest = JSON.parse(
    readFileSync(path.join(repo, "package.json"), "utf8")
  )
  const declared = new Set([
    ...Object.keys(manifest.dependencies),
    ...Object.keys(manifest.devDependencies),
  ])

  it("only asks users to install packages the library itself depends on", () => {
    const missing = registry.items.flatMap((entry) =>
      entry.dependencies
        .filter((dependency) => !declared.has(dependency))
        .map((dependency) => `${entry.name}: ${dependency}`)
    )
    expect(missing).toEqual([])
  })

  it("never installs dev-only tooling into user projects", () => {
    const devOnly = new Set(Object.keys(manifest.devDependencies))
    const leaked = registry.items.flatMap((entry) =>
      entry.dependencies
        .filter((dependency) => devOnly.has(dependency))
        .map((dependency) => `${entry.name}: ${dependency}`)
    )
    expect(leaked).toEqual([])
  })

  it("points every item at a file that exists", () => {
    const missing = registry.items.flatMap((entry) =>
      entry.files.filter((file) => !existsSync(path.join(repo, file)))
    )
    expect(missing).toEqual([])
  })
})
