import { spawnSync } from "node:child_process"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { init } from "../../packages/cli/lib/init.mjs"
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
  "registry.json": {
    stylesheet: "styles/globals.css",
    items: [
      {
        name: "button",
        type: "ui",
        requires: [],
        dependencies: ["@base-ui/react"],
        files: ["components/ui/button.tsx"],
      },
    ],
  },
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
