import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../lib/add.mjs"
import { init } from "../lib/init.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
  viteProject,
} from "./helpers.mjs"

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const stylesheet = `@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "./theme.css";

@theme {
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;
}
`

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
    ],
  },
  "registry/radix/registry.json": {
    name: "esuiss",
    homepage: "https://suiss.app/ui",
    items: [
      {
        name: "button",
        type: "registry:ui",
        dependencies: ["radix-ui"],
        files: [
          { path: "bases/radix/components/ui/button.tsx", type: "registry:ui" },
        ],
      },
    ],
  },
  "bases/radix/components/ui/button.tsx": "export function RadixButton() {}\n",
  "styles/globals.css": stylesheet,
  "components/ui/button.tsx": "export function Button() {}\n",
}

const viteConfig = `import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
})
`

function nextProject(extra = {}) {
  return createProject({
    "package.json": {
      dependencies: { next: "16.0.0", react: "19.0.0" },
      devDependencies: { tailwindcss: "4.2.0" },
    },
    "tsconfig.json": `{
  "compilerOptions": {
    "strict": true
  }
}`,
    "app/layout.tsx": `import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
    ...extra,
  })
}

const FONT_ON_HTML =
  /<html className=\{`\$\{fontInter\.variable\}`\} lang="en">/
const FONT_BESIDE_CLASS =
  /className=\{`\$\{fontInter\.variable\} antialiased`\}/

const FONT_BEFORE_TEMPLATE =
  /className=\{`\$\{fontInter\.variable\} \$\{geist\.variable\} h-full`\}/

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

describe("init in a Vite project", () => {
  it("adds the tailwind plugin and the @ alias to vite.config.ts", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const config = read(cwd, "vite.config.ts")
    expect(config).toContain('import tailwindcss from "@tailwindcss/vite"')
    expect(config).toContain("plugins: [tailwindcss(), react()]")
    expect(config).toContain(
      '"@": fileURLToPath(new URL("./src", import.meta.url))'
    )
    expect(config).toContain('import { fileURLToPath } from "node:url"')
  })

  it("writes the stylesheet and the button", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    expect(read(cwd, "src/index.css")).toBe(stylesheet)
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      files["components/ui/button.tsx"]
    )
    expect(output()).toContain("Import src/index.css in src/main.tsx.")
  })

  it("installs the animation and variant packages the stylesheet imports", async () => {
    serveRegistry({
      ...files,
      "styles/globals.css": `@import "tailwindcss";\n@import "tw-animate-css";\n@import "shadcn/tailwind.css";\n`,
    })
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const commands = vi
      .mocked(spawnSync)
      .mock.calls.map(([, args]) => args.join(" "))
    expect(commands).toContain("install tw-animate-css shadcn")
  })

  it("installs the tooling and the packages the stylesheet imports", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const commands = vi
      .mocked(spawnSync)
      .mock.calls.map(([, args]) => args.join(" "))
    expect(commands).toEqual([
      "install --save-dev @tailwindcss/vite @types/node",
      "install @fontsource-variable/inter",
      "install @base-ui/react",
    ])
  })

  it("does not touch a config that is already set up", async () => {
    const configured = `import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { "@": "/src" } },
})
`
    const cwd = viteProject({ "vite.config.ts": configured })
    await init({ cwd, yes: true })
    expect(read(cwd, "vite.config.ts")).toBe(configured)
  })

  it("requires a src directory", async () => {
    const cwd = createProject({
      "package.json": {
        dependencies: { react: "19.0.0" },
        devDependencies: { vite: "7.0.0" },
      },
      "tsconfig.json": {},
    })
    await expect(init({ cwd, yes: true })).rejects.toThrow(
      "Expected a src/ directory in this Vite project."
    )
  })

  it("requires Tailwind CSS 4.2 or later", async () => {
    const cwd = viteProject({
      "package.json": {
        dependencies: { react: "19.0.0" },
        devDependencies: { vite: "7.0.0", tailwindcss: "^4.1.0" },
      },
    })
    await expect(init({ cwd, yes: true })).rejects.toThrow(
      "Tailwind CSS 4.2 or later is required, this project uses ^4.1.0."
    )
  })

  it("will not replace an existing stylesheet without --yes", async () => {
    const cwd = viteProject({ "src/index.css": "body { color: red }" })
    await expect(init({ cwd })).rejects.toThrow(
      "Cancelled. Run again with --yes to replace the stylesheet."
    )
    expect(read(cwd, "src/index.css")).toBe("body { color: red }")
  })
})

describe("init options", () => {
  it("saves --base as the style of a new components.json", async () => {
    const cwd = viteProject()
    await init({ cwd, yes: true, base: "radix" })
    const config = JSON.parse(read(cwd, "components.json"))
    expect(config.style).toBe("radix-suiss")
    expect(config.tailwind.css).toBe("src/index.css")
    expect(config.rsc).toBe(false)
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      "export function RadixButton() {}\n"
    )

    await add(["button"], { cwd, overwrite: true })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      "export function RadixButton() {}\n"
    )
  })

  it("keeps the rest of components.json and the style name", async () => {
    const cwd = viteProject({
      "components.json": {
        style: "aria-vega",
        tailwind: { css: "src/index.css" },
        aliases: { ui: "@/components/ui" },
      },
    })
    await init({ cwd, yes: true, base: "radix" })
    expect(JSON.parse(read(cwd, "components.json"))).toEqual({
      style: "radix-vega",
      tailwind: { css: "src/index.css" },
      aliases: { ui: "@/components/ui" },
    })
  })

  it("does not write components.json for the default base", async () => {
    const cwd = viteProject()
    await init({ cwd, yes: true, base: "base" })
    expect(existsSync(path.join(cwd, "components.json"))).toBe(false)
  })

  it("replaces a changed button with --overwrite", async () => {
    const cwd = viteProject({
      "src/components/ui/button.tsx": "export function Button() { edited }\n",
    })
    await init({ cwd, yes: true })
    expect(read(cwd, "src/components/ui/button.tsx")).toContain("edited")
    await init({ cwd, yes: true, overwrite: true })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(
      "export function Button() {}\n"
    )
  })

  it("writes the stylesheet named in components.json", async () => {
    const cwd = viteProject({
      "components.json": { tailwind: { css: "src/styles/app.css" } },
    })
    await init({ cwd, yes: true })
    expect(read(cwd, "src/styles/app.css")).toBe(stylesheet)
    expect(existsSync(path.join(cwd, "src/index.css"))).toBe(false)
  })

  it("asks to import the stylesheet when it is not imported", async () => {
    const cwd = viteProject()
    await init({ cwd, yes: true })
    expect(output()).toContain("Import src/index.css in src/main.tsx.")
  })

  it("does not ask to import a stylesheet that is imported", async () => {
    const cwd = viteProject({ "src/main.tsx": 'import "./index.css"\n' })
    await init({ cwd, yes: true })
    expect(output()).not.toContain("Import src/index.css")
  })
})

describe("init in a Next.js project", () => {
  it("adds the @/* alias to tsconfig.json", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true })
    expect(JSON.parse(read(cwd, "tsconfig.json"))).toEqual({
      compilerOptions: { paths: { "@/*": ["./*"] }, strict: true },
    })
  })

  it("creates a postcss config", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true })
    expect(read(cwd, "postcss.config.mjs")).toContain("@tailwindcss/postcss")
  })

  it("loads the fonts with next/font instead of fontsource", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true })
    const css = read(cwd, "app/globals.css")
    expect(css).not.toContain("@fontsource")
    expect(css).toContain("var(--font-inter)")
    expect(css).not.toContain("questrial")

    const layout = read(cwd, "app/layout.tsx")
    expect(layout).toContain('import { Inter } from "next/font/google";')
    expect(layout).toContain('variable: "--font-inter",')
    expect(layout).toMatch(FONT_ON_HTML)
  })

  it("keeps an existing className on <html>", async () => {
    const cwd = nextProject({
      "app/layout.tsx": `export default function RootLayout({ children }) {
  return <html className="antialiased">{children}</html>
}
`,
    })
    await init({ cwd, yes: true })
    expect(read(cwd, "app/layout.tsx")).toMatch(FONT_BESIDE_CLASS)
  })

  it("adds the font to a template literal className on <html>", async () => {
    const cwd = nextProject({
      "app/layout.tsx": `export default function RootLayout({ children }) {
  return <html className={\`\${geist.variable} h-full\`}>{children}</html>
}
`,
    })
    await init({ cwd, yes: true })
    expect(read(cwd, "app/layout.tsx")).toMatch(FONT_BEFORE_TEMPLATE)
  })

  it("relies on the Turbopack Tailwind loader when next.config uses it", async () => {
    const cwd = nextProject({
      "next.config.ts": `export default {
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"] } } },
}
`,
    })
    await init({ cwd, yes: true })
    expect(existsSync(path.join(cwd, "postcss.config.mjs"))).toBe(false)
  })

  it("leaves a layout that already loads Inter alone", async () => {
    const layout = `import { Inter } from "next/font/google"
const inter = Inter({ variable: "--font-inter" })
`
    const cwd = nextProject({ "app/layout.tsx": layout })
    await init({ cwd, yes: true })
    expect(read(cwd, "app/layout.tsx")).toBe(layout)
  })

  it("asks for the app directory when there is none", async () => {
    const bare = createProject({
      "package.json": {
        dependencies: { next: "16.0.0" },
        devDependencies: { tailwindcss: "4.2.0" },
      },
      "tsconfig.json": {},
    })
    await expect(init({ cwd: bare, yes: true })).rejects.toThrow(
      "Could not find the app directory (app/ or src/app/)."
    )
  })
})

describe("init with a preset", () => {
  const themed = `@import "tailwindcss";

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
      light: {
        background: "oklch(1 0 0 / 1)",
        primary: "oklch(0.2 0 0)",
        radius: "0.625rem",
      },
      dark: { background: "oklch(0.1 0 0)", primary: "oklch(0.9 0 0)" },
    },
    {
      name: "emerald",
      light: { primary: "oklch(0.6 0.13 163)" },
      dark: { primary: "oklch(0.7 0.15 162)" },
    },
  ]

  beforeEach(() => {
    serveRegistry({
      ...files,
      "styles/globals.css": themed,
      "registry/themes.json": themes,
    })
  })

  it("applies the colors, radius, style and icons of the code", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: "bJ4oV1t" })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--radius: 0;")
    expect(css).toContain("--primary: oklch(0.6 0.13 163);")
    expect(css).toContain("--background: oklch(1 0 0 / 1);")
    expect(css).toContain("--primary: oklch(0.7 0.15 162);")
    const config = JSON.parse(read(cwd, "components.json"))
    expect(config).toMatchObject({
      style: "base-vega",
      iconLibrary: "lucide",
      menuColor: "inverted",
    })
  })

  it("keeps the suiss colors with --theme suiss", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({
      cwd,
      yes: true,
      preset: "bJ4oV1t",
      theme: "suiss",
      style: "suiss",
    })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--primary: oklch(0.56 0.19 256);")
    expect(css).toContain("--radius: 0;")
    expect(JSON.parse(read(cwd, "components.json")).style).toBe("base-suiss")
  })

  it("sets a custom primary over the preset colors", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: "bJ4oV1t", primary: "#e11d48" })
    const css = read(cwd, "src/index.css")
    const [light, dark] = css.split(".dark")
    expect(light).toContain("--primary: oklch(0.5858 0.222 17.58);")
    expect(dark).toContain("--primary: oklch(0.5858 0.222 17.58);")
    expect(light).toContain("--background: oklch(1 0 0 / 1);")
    expect(light).toContain("--radius: 0;")
  })

  it("sets a custom primary without a preset", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, primary: "oklch(0.7 0.15 162)" })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--primary: oklch(0.7 0.15 162);")
    expect(css).toContain("--radius: 0.625rem;")
    expect(css).toContain("--background: oklch(0 0 0);")
  })
})
