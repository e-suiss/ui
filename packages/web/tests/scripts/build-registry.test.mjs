import { execFileSync } from "node:child_process"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { createProject } from "../../../cli/tests/helpers.mjs"

const repo = new URL("../..", import.meta.url).pathname
const PACKAGE = "packages/web"
const SCRIPTS = [
  [
    "packages/web/scripts/build-registry.mjs",
    `${PACKAGE}/scripts/build-registry.mjs`,
  ],
  ["scripts/lib/registry.mjs", "scripts/lib/registry.mjs"],
]

const DOCS = {
  "components/ui": "components",
  "components/patterns": "patterns",
  "components/interactions": "interactions",
  "components/charts": "charts",
  "components/blocks": "blocks",
}
const SOURCE = /^(components\/\w+)\/([\w-]+)\.tsx$/
const DOC_TITLES = { "qr-scanner": "QR Code Scanner" }

function docsPages(files) {
  return Object.keys(files).flatMap((file) => {
    const match = file.match(SOURCE)
    const docs = match && DOCS[match[1]]
    return docs
      ? [
          [
            `apps/ui/content/docs/${docs}/${match[2]}.mdx`,
            `---\n${DOC_TITLES[match[2]] ? `title: ${DOC_TITLES[match[2]]}\n` : ""}description: "About ${match[2]}."\n---\n`,
          ],
        ]
      : []
  })
}

function fakeRepo(files, { docs = true } = {}) {
  const root = createProject(
    Object.fromEntries([
      ...Object.entries(files).map(([file, content]) => [
        `${PACKAGE}/${file}`,
        content,
      ]),
      ...(docs ? docsPages(files) : []),
    ])
  )
  for (const [from, to] of SCRIPTS) {
    mkdirSync(path.dirname(path.join(root, to)), { recursive: true })
    copyFileSync(path.join(repo, "../..", from), path.join(root, to))
  }
  symlinkSync(
    path.join(repo, "node_modules"),
    path.join(root, PACKAGE, "node_modules")
  )
  return path.join(root, PACKAGE)
}

function build(cwd, ...args) {
  try {
    const script = path.join(cwd, "scripts/build-registry.mjs")
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

function standardOf(cwd) {
  return JSON.parse(
    readFileSync(path.join(cwd, "registry/registry.json"), "utf8")
  )
}

function project(files) {
  return fakeRepo({ "styles/globals.css": "", ...files })
}

const item = (cwd, name) =>
  registryOf(cwd).items.find((entry) => entry.name === name)

const standardItem = (cwd, name) =>
  standardOf(cwd).items.find((entry) => entry.name === name)

function baseOf(cwd, base) {
  return JSON.parse(
    readFileSync(path.join(cwd, `registry/${base}/registry.json`), "utf8")
  )
}

const radixOf = (cwd) => baseOf(cwd, "radix")

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
      "lib/utils.ts": "export {}",
      "components/ui/notes.md": "",
      "components/ui/button.css": "",
    })
    const result = build(cwd)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("registry/registry.json: 9 items")
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
      ["utils", "lib", "Utils", ["lib/utils.ts"]],
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
import { clsx } from "clsx"
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
      "clsx",
      "input-otp",
    ])
  })

  it("marks items that use icon placeholders", () => {
    const cwd = project({
      "components/ui/dialog.tsx": `import { Dialog } from "@base-ui/react/dialog"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
`,
      "components/ui/button.tsx": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "dialog")).toMatchObject({
      dependencies: ["@base-ui/react"],
      requires: [],
      icons: true,
    })
    expect(item(cwd, "button")).not.toHaveProperty("icons")
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
      "hooks/use-mobile.ts": `import { cn } from "@/lib/utils"`,
      "lib/utils.ts": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "dialog").requires).toEqual(["button"])
    expect(item(cwd, "confirm").requires).toEqual([
      "button",
      "dialog",
      "use-mobile",
    ])
    expect(item(cwd, "use-mobile").requires).toEqual(["utils"])
    expect(item(cwd, "button").requires).toEqual([])
  })

  it("marks the theme as opt-in only", () => {
    const cwd = project({
      "components/ui/theme.tsx": "export {}",
      "components/ui/button.tsx": "export {}",
      "styles/theme.css": "",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "theme").optIn).toBe(true)
    expect(item(cwd, "button")).not.toHaveProperty("optIn")
  })

  it("ships the theme transition styles with the theme", () => {
    const cwd = project({
      "components/ui/theme.tsx": "export {}",
      "components/ui/button.tsx": "export {}",
      "styles/theme.css": "",
    })
    expect(build(cwd).code).toBe(0)
    expect(item(cwd, "theme").css).toBe("styles/theme.css")
    expect(item(cwd, "button")).not.toHaveProperty("css")
  })

  it("requires the styles an item ships with", () => {
    const cwd = project({ "components/ui/theme.tsx": "export {}" })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("missing styles/theme.css")
  })

  it("rejects a local import outside the registry folders", () => {
    const cwd = project({
      "components/ui/button.tsx": 'import { site } from "@/app/site"',
    })
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      'components/ui/button.tsx: unsupported local import "@/app/site"'
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
    const cwd = fakeRepo({ "components/ui/button.tsx": "export {}" })
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
    expect(result.stdout).toContain(
      "The registry is up to date and valid: 2 items"
    )

    writeFileSync(
      path.join(cwd, "components/ui/button.tsx"),
      'import { clsx } from "clsx"'
    )
    const stale = build(cwd, "--check")
    expect(stale.code).toBe(1)
    expect(stale.stderr).toContain(
      "Out of date: registry/registry.json, registry.json. Run `pnpm registry`."
    )
    expect(item(cwd, "button").dependencies).toEqual([])
  })
})

describe("the standard registry", () => {
  it("describes the registry for the registry CLI", () => {
    const cwd = project({ "components/ui/button.tsx": "export {}" })
    expect(build(cwd).code).toBe(0)
    expect(standardOf(cwd)).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "esuiss",
      homepage: "https://suiss.app/ui",
    })
  })

  it("maps every folder to a registry type and keeps nested folders", () => {
    const cwd = project({
      "components/ui/button.tsx": "export {}",
      "components/patterns/date-picker.tsx": "export {}",
      "components/interactions/swipe-actions.tsx": "export {}",
      "components/charts/bar-chart-active.tsx": "export {}",
      "components/blocks/login-account.tsx": "export {}",
      "hooks/use-mobile.ts": "export {}",
      "lib/utils.ts": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(
      standardOf(cwd).items.map(({ name, type, files }) => [name, type, files])
    ).toEqual([
      [
        "button",
        "registry:ui",
        [{ path: "components/ui/button.tsx", type: "registry:ui" }],
      ],
      [
        "date-picker",
        "registry:component",
        [
          {
            path: "components/patterns/date-picker.tsx",
            type: "registry:component",
            target: "@components/patterns/date-picker.tsx",
          },
        ],
      ],
      [
        "swipe-actions",
        "registry:component",
        [
          {
            path: "components/interactions/swipe-actions.tsx",
            type: "registry:component",
            target: "@components/interactions/swipe-actions.tsx",
          },
        ],
      ],
      [
        "bar-chart-active",
        "registry:block",
        [
          {
            path: "components/charts/bar-chart-active.tsx",
            type: "registry:component",
            target: "@components/charts/bar-chart-active.tsx",
          },
        ],
      ],
      [
        "login-account",
        "registry:block",
        [
          {
            path: "components/blocks/login-account.tsx",
            type: "registry:component",
            target: "@components/blocks/login-account.tsx",
          },
        ],
      ],
      [
        "use-mobile",
        "registry:hook",
        [{ path: "hooks/use-mobile.ts", type: "registry:hook" }],
      ],
      [
        "utils",
        "registry:lib",
        [{ path: "lib/utils.ts", type: "registry:lib" }],
      ],
      ["theme-suiss", "registry:theme", undefined],
    ])
    expect(standardItem(cwd, "bar-chart-active").categories).toEqual([
      "charts",
      "charts-bar",
    ])
  })

  it("namespaces its own dependencies and keeps the built-in utils", () => {
    const cwd = project({
      "components/ui/button.tsx": 'import { cn } from "@/lib/utils"',
      "components/ui/dialog.tsx": `import { Button } from "@/components/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Dialog } from "@base-ui/react/dialog"
`,
      "lib/utils.ts": 'export { cn } from "cn"',
    })
    expect(build(cwd).code).toBe(0)
    expect(standardItem(cwd, "button").registryDependencies).toEqual([
      "@esuiss/utils",
    ])
    expect(standardItem(cwd, "dialog")).toMatchObject({
      dependencies: ["@base-ui/react"],
      registryDependencies: ["@esuiss/button"],
    })
    expect(standardItem(cwd, "utils").dependencies).toEqual(["cn"])
  })

  it("takes titles, descriptions and links from the docs", () => {
    const cwd = project({
      "components/ui/alert-dialog.tsx": "export {}",
      "components/ui/qr-scanner.tsx": "export {}",
      "components/ui/input-otp.tsx": "export {}",
    })
    expect(build(cwd).code).toBe(0)
    expect(standardItem(cwd, "qr-scanner").title).toBe("QR Code Scanner")
    expect(standardItem(cwd, "input-otp").title).toBe("Input OTP")
    expect(standardItem(cwd, "alert-dialog")).toMatchObject({
      title: "Alert Dialog",
      description: "About alert-dialog.",
      meta: {
        links: { docs: "https://suiss.app/ui/docs/components/alert-dialog" },
      },
    })
  })

  it("reports an item without a description", () => {
    const cwd = fakeRepo(
      { "styles/globals.css": "", "components/ui/button.tsx": "export {}" },
      { docs: false }
    )
    const result = build(cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("button has no description")
  })

  it("ships the theme styles as rules", () => {
    const cwd = project({
      "components/ui/theme.tsx": "export {}",
      "styles/theme.css": `@keyframes theme-mask {
  to {
    mask-size: 350vmax;
  }
}

html[data-theme-transition]::view-transition-new(
  root
) {
  animation: theme-mask 1s
    ease-out;
}
`,
    })
    expect(build(cwd).code).toBe(0)
    expect(standardItem(cwd, "theme")).toMatchObject({
      css: {
        "@keyframes theme-mask": { to: { "mask-size": "350vmax" } },
        "html[data-theme-transition]::view-transition-new(root)": {
          animation: "theme-mask 1s ease-out",
        },
      },
      meta: { optIn: true },
    })
  })

  it("publishes the theme variables as a theme item", () => {
    const cwd = project({
      "styles/globals.css": `:root {
  --radius: 0.625rem;
  --primary: oklch(0.56 0.19 256);
}

.dark {
  --primary: oklch(0.67 0.18 252);
}

@theme inline {
  --font-sans: -apple-system, sans-serif;
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}
`,
    })
    expect(build(cwd).code).toBe(0)
    expect(standardItem(cwd, "theme-suiss")).toMatchObject({
      type: "registry:theme",
      dependencies: ["@fontsource-variable/inter"],
      cssVars: {
        theme: {
          "font-sans": "-apple-system, sans-serif",
          "radius-lg": "var(--radius)",
        },
        light: { radius: "0.625rem", primary: "oklch(0.56 0.19 256)" },
        dark: { primary: "oklch(0.67 0.18 252)" },
      },
      css: { '@import "@fontsource-variable/inter"': {} },
    })
  })
})

describe("a second primitive base", () => {
  const files = {
    "components/ui/button.tsx": `import { Slot } from "@base-ui/react/slot"
import { cn } from "@/lib/utils"
`,
    "components/ui/dialog.tsx": `import { Dialog } from "@base-ui/react/dialog"
import { Button } from "@/components/ui/button"
import { useScrollbarGap } from "@/hooks/use-scrollbar-gap"
`,
    "components/patterns/flyout.tsx": `import { Dialog } from "@/components/ui/dialog"`,
    "hooks/use-scrollbar-gap.ts": "export {}",
    "lib/utils.ts": 'export { cn } from "cn"',
    "bases/radix/files.json": JSON.stringify({
      base: "radix",
      files: ["components/patterns/flyout.tsx", "components/ui/dialog.tsx"],
    }),
    "bases/radix/components/ui/dialog.tsx": `import { Dialog } from "radix-ui"
import { Button } from "@/components/ui/button"
`,
    "bases/radix/components/patterns/flyout.tsx": `import { Dialog } from "@/components/ui/dialog"
import { Slot } from "radix-ui"
`,
  }

  it("publishes a registry per base with the same item names", () => {
    const cwd = project(files)
    const result = build(cwd)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("registry/radix/registry.json: 6 items")
    expect(radixOf(cwd).items.map((entry) => entry.name)).toEqual(
      standardOf(cwd).items.map((entry) => entry.name)
    )
    expect(radixOf(cwd)).toMatchObject({ name: "esuiss" })
  })

  it("takes twinned files and their dependencies from the base", () => {
    const cwd = project(files)
    expect(build(cwd).code).toBe(0)
    const radix = (name) =>
      radixOf(cwd).items.find((entry) => entry.name === name)
    expect(radix("dialog")).toMatchObject({
      dependencies: ["radix-ui"],
      registryDependencies: ["@esuiss/button"],
      files: [
        { path: "bases/radix/components/ui/dialog.tsx", type: "registry:ui" },
      ],
    })
    expect(radix("flyout")).toMatchObject({
      dependencies: ["radix-ui"],
      files: [
        {
          path: "bases/radix/components/patterns/flyout.tsx",
          target: "@components/patterns/flyout.tsx",
        },
      ],
    })
    expect(radix("button")).toEqual(standardItem(cwd, "button"))
    expect(standardItem(cwd, "dialog").dependencies).toEqual(["@base-ui/react"])
  })

  it("checks the base registries too", () => {
    const cwd = project(files)
    expect(build(cwd).code).toBe(0)
    writeFileSync(
      path.join(cwd, "bases/radix/components/ui/dialog.tsx"),
      'import { Dialog } from "radix-ui"'
    )
    const stale = build(cwd, "--check")
    expect(stale.code).toBe(1)
    expect(stale.stderr).toContain("Out of date: registry/radix/registry.json.")
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

  it("lists every standard item with existing files and known dependencies", () => {
    const standard = standardOf(repo)
    const names = new Set(standard.items.map((entry) => entry.name))
    const problems = standard.items.flatMap((entry) => [
      ...(entry.files ?? [])
        .filter(
          (file) => "content" in file || !existsSync(path.join(repo, file.path))
        )
        .map((file) => `${entry.name}: ${file.path}`),
      ...(entry.registryDependencies ?? [])
        .filter((name) => !names.has(name.replace("@esuiss/", "")))
        .map((name) => `${entry.name}: ${name}`),
    ])
    expect(problems).toEqual([])
  })

  it.each(["radix", "aria"])(
    "lists every item of the %s base with existing files",
    (base) => {
      const standard = standardOf(repo)
      const variant = baseOf(repo, base)
      expect(variant.items.map((entry) => entry.name)).toEqual(
        standard.items.map((entry) => entry.name)
      )
      const problems = variant.items.flatMap((entry) => [
        ...(entry.files ?? [])
          .filter((file) => !existsSync(path.join(repo, file.path)))
          .map((file) => `${entry.name}: ${file.path}`),
        ...(entry.dependencies ?? [])
          .filter((dependency) => !declared.has(dependency))
          .map((dependency) => `${entry.name}: ${dependency}`),
      ])
      expect(problems).toEqual([])
    }
  )

  it("points every item at a file that exists", () => {
    const missing = registry.items.flatMap((entry) =>
      entry.files.filter((file) => !existsSync(path.join(repo, file)))
    )
    expect(missing).toEqual([])
  })
})
