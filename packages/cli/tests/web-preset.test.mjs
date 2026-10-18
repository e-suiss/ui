import { spawnSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { add } from "../lib/add.mjs"
import { apply } from "../lib/apply.mjs"
import { init } from "../lib/init.mjs"
import { applyMenuColor, BOLD_ACCENT } from "../lib/styles.mjs"
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
@import "tw-animate-css";
@import "@fontsource-variable/inter";

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --primary: oklch(0.56 0.19 256);
  --primary-foreground: oklch(1 0 0);
  --ring: oklch(0.56 0.19 256);
}

.dark {
  --background: oklch(0 0 0);
  --primary: oklch(0.6 0.19 256);
  --primary-foreground: oklch(1 0 0);
  --ring: oklch(0.56 0.19 256);
}

@theme inline {
  --font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;
}
`

const themes = [
  {
    name: "zinc",
    light: { background: "oklch(0.99 0 0)", primary: "oklch(0.2 0 0)" },
    dark: { background: "oklch(0.14 0 0)", primary: "oklch(0.9 0 0)" },
  },
  {
    name: "stone",
    light: { background: "oklch(0.98 0 0)", primary: "oklch(0.21 0 0)" },
    dark: { background: "oklch(0.15 0 0)", primary: "oklch(0.91 0 0)" },
  },
  {
    name: "neutral",
    light: { background: "oklch(1 0 0 / 1)", primary: "oklch(0.205 0 0)" },
    dark: { background: "oklch(0.145 0 0)", primary: "oklch(0.922 0 0)" },
  },
  {
    name: "blue",
    light: { primary: "oklch(0.488 0.243 264.376)" },
    dark: { primary: "oklch(0.424 0.199 265.638)" },
  },
]

const menu = `export function Menu() {
  return <div data-slot="dropdown-menu-content" className="cn-menu-target cn-menu-translucent z-50" />
}
`

const registry = {
  name: "esuiss",
  homepage: "https://suiss.app/ui",
  items: [
    {
      name: "button",
      type: "registry:ui",
      dependencies: ["@base-ui/react"],
      files: [{ path: "components/ui/button.tsx", type: "registry:ui" }],
    },
    {
      name: "dropdown-menu",
      type: "registry:ui",
      dependencies: ["@base-ui/react", "menu-only-package"],
      files: [{ path: "components/ui/dropdown-menu.tsx", type: "registry:ui" }],
    },
    {
      name: "theme",
      type: "registry:ui",
      dependencies: [],
      css: { "@keyframes theme-reveal": { to: { opacity: "1" } } },
      meta: { optIn: true },
      files: [{ path: "components/ui/theme.tsx", type: "registry:ui" }],
    },
  ],
}

const files = {
  "registry/registry.json": registry,
  "registry/themes.json": themes,
  "styles/globals.css": stylesheet,
  "components/ui/button.tsx": "export function Button() {}\n",
  "components/ui/dropdown-menu.tsx": menu,
  "components/ui/theme.tsx": "export function Theme() {}\n",
}

const viteConfig = `import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
})
`

const createNextLayout = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}>
        {children}
      </body>
    </html>
  );
}
`

const GLOBAL_STYLE = /<style jsx global>/g
const GEIST_ON_HTML =
  /<html className=\{`\$\{fontGeist\.variable\}`\} lang="en">/
const MONO_CLASS = /\$\{fontJetbrainsMono\.variable\}/

function preset(overrides = {}) {
  const config = {
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "phosphor",
    font: "inter",
    radius: "default",
    menuAccent: "subtle",
    menuColor: "default",
    ...overrides,
  }
  return encodePreset({ chartColor: config.theme, ...config })
}

const SUISS = preset()

function nextProject(extra = {}) {
  return createProject({
    "package.json": {
      dependencies: { next: "16.4.2", react: "19.0.0" },
      devDependencies: {
        tailwindcss: "^4",
        "@tailwindcss/turbopack": "^4",
      },
    },
    "next.config.ts": `export default {
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"] } } },
}
`,
    "tsconfig.json": {
      compilerOptions: { paths: { "@/*": ["./src/*"] } },
    },
    "src/app/layout.tsx": createNextLayout,
    "src/app/globals.css": "",
    ...extra,
  })
}

function installed() {
  return vi
    .mocked(spawnSync)
    .mock.calls.filter(([, args]) => args?.[0] === "install")
    .flatMap(([, args]) => args.slice(1).filter((arg) => !arg.startsWith("-")))
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

describe("fonts on Vite", () => {
  it("imports the Fontsource package of the preset font and uses it", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: preset({ font: "geist" }) })
    const css = read(cwd, "src/index.css")
    expect(css).toContain('@import "@fontsource-variable/geist";')
    expect(css).not.toContain("@fontsource-variable/inter")
    expect(css).toContain("--font-sans: 'Geist Variable', sans-serif;")
    expect(installed()).toContain("@fontsource-variable/geist")
    expect(output()).not.toContain("Load the geist font")
  })

  it("keeps the monospace and serif fallbacks", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: preset({ font: "jetbrains-mono" }) })
    expect(read(cwd, "src/index.css")).toContain(
      "--font-sans: 'JetBrains Mono Variable', monospace;"
    )
  })

  it("switches the font with apply --only font and back to Inter", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const original = read(cwd, "src/index.css")
    await apply({ cwd, only: "font", preset: preset({ font: "lora" }) })
    const css = read(cwd, "src/index.css")
    expect(css).toContain('@import "@fontsource-variable/lora";')
    expect(css).toContain("--font-sans: 'Lora Variable', serif;")
    expect(css).toContain("--primary: oklch(0.56 0.19 256);")
    expect(output()).toContain("Updated src/index.css")
    await apply({ cwd, only: "font", preset: SUISS })
    expect(read(cwd, "src/index.css")).toBe(original)
  })
})

describe("fonts on Next.js", () => {
  it("loads the preset font with next/font/google beside the template fonts", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: preset({ font: "geist" }) })
    const layout = read(cwd, "src/app/layout.tsx")
    expect(layout).toContain(
      'import { Geist, Geist_Mono } from "next/font/google";'
    )
    expect(layout).toContain(`const fontGeist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
});`)
    expect(layout).toMatch(GEIST_ON_HTML)
    const css = read(cwd, "src/app/globals.css")
    expect(css).toContain("--font-sans: var(--font-geist), sans-serif;")
    expect(css).not.toContain("@fontsource")
  })

  it("replaces the font it loaded before and drops the unused import", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true })
    expect(read(cwd, "src/app/layout.tsx")).toContain(
      "const fontInter = Inter("
    )
    await apply({
      cwd,
      only: "font",
      preset: preset({ font: "jetbrains-mono" }),
    })
    const layout = read(cwd, "src/app/layout.tsx")
    expect(layout).not.toContain("Inter")
    expect(layout).toContain(
      'import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";'
    )
    expect(layout).toContain("const fontJetbrainsMono = JetBrains_Mono({")
    expect(layout).toMatch(MONO_CLASS)
    expect(layout.match(/const font[A-Z]/g)).toHaveLength(1)
    expect(read(cwd, "src/app/globals.css")).toContain(
      "--font-sans: var(--font-jetbrains-mono), monospace;"
    )
  })

  it("keeps an import the template still uses", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: preset({ font: "geist" }) })
    await apply({ cwd, only: "font", preset: SUISS })
    const layout = read(cwd, "src/app/layout.tsx")
    expect(layout).toContain(
      'import { Geist, Geist_Mono, Inter } from "next/font/google";'
    )
    expect(layout).toContain("const fontInter = Inter(")
    expect(layout).not.toContain("fontGeist")
    expect(read(cwd, "src/app/globals.css")).toContain(
      "--font-sans: -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif;"
    )
  })

  it("passes the only weight of a static font", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: preset({ font: "instrument-serif" }) })
    expect(read(cwd, "src/app/layout.tsx")).toContain(`Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-instrument-serif",
});`)
  })

  it("does not add @tailwindcss/postcss to a Turbopack Tailwind project", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true })
    expect(installed()).not.toContain("@tailwindcss/postcss")
  })
})

const INTER = preset({ fontHeading: "inter" })

const pagesApp = `import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`

function pagesFontLine(name, id) {
  return `--font-${name}: ${"$"}{${id}.style.fontFamily};`
}

function pagesProject() {
  return createProject({
    "package.json": {
      dependencies: { next: "16.4.2", react: "19.0.0" },
      devDependencies: { tailwindcss: "^4", "@tailwindcss/postcss": "^4" },
    },
    "postcss.config.mjs":
      'export default { plugins: { "@tailwindcss/postcss": {} } }\n',
    "tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
    "src/pages/_app.tsx": pagesApp,
    "src/styles/globals.css": "",
  })
}

describe("an explicit Inter choice", () => {
  it("uses Inter instead of the system font on Vite", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: INTER })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--font-sans: 'Inter Variable', sans-serif;")
    expect(css).toContain('@import "@fontsource-variable/inter";')
  })

  it("uses Inter instead of the system font on Next.js", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: INTER })
    expect(read(cwd, "src/app/globals.css")).toContain(
      "--font-sans: var(--font-inter), sans-serif;"
    )
    expect(read(cwd, "src/app/layout.tsx")).toContain(
      "const fontInter = Inter("
    )
  })

  it("goes back to the system font with the suiss preset", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const original = read(cwd, "src/index.css")
    await apply({ cwd, only: "font", preset: INTER })
    expect(read(cwd, "src/index.css")).not.toBe(original)
    await apply({ cwd, only: "font", preset: SUISS })
    expect(read(cwd, "src/index.css")).toBe(original)
  })
})

describe("a font the template already loads", () => {
  const MONO = preset({ font: "geist-mono" })

  it("reuses the template font with latin-ext on init", async () => {
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: MONO })
    const layout = read(cwd, "src/app/layout.tsx")
    expect(layout).not.toContain("fontGeistMono")
    expect(layout).toContain(`const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});`)
    expect(layout).toContain('<html lang="en">')
  })

  it("ends with the same layout when applied after another font", async () => {
    const fresh = nextProject()
    await init({ cwd: fresh, yes: true, preset: MONO })
    const cwd = nextProject()
    await init({ cwd, yes: true, preset: preset({ font: "lora" }) })
    await apply({ cwd, only: "font", preset: MONO })
    expect(read(cwd, "src/app/layout.tsx")).toBe(
      read(fresh, "src/app/layout.tsx")
    )
  })
})

describe("fonts in the Pages Router", () => {
  it("loads the font in _app and sets its variable on :root", async () => {
    const cwd = pagesProject()
    await init({ cwd, yes: true, preset: preset({ font: "figtree" }) })
    const app = read(cwd, "src/pages/_app.tsx")
    expect(app).toContain('import { Figtree } from "next/font/google";')
    expect(app).toContain("const fontFigtree = Figtree({")
    expect(app).toContain(pagesFontLine("figtree", "fontFigtree"))
    expect(app).toContain("<style jsx global>")
    expect(app).toContain("<Component {...pageProps} />")
    expect(output()).not.toContain("Import src/styles/globals.css")
    expect(output()).not.toContain("root layout")
  })

  it("switches the font in _app", async () => {
    const cwd = pagesProject()
    await init({ cwd, yes: true, preset: preset({ font: "figtree" }) })
    await apply({ cwd, only: "font", preset: preset({ font: "lora" }) })
    const app = read(cwd, "src/pages/_app.tsx")
    expect(app).not.toContain("Figtree")
    expect(app).toContain(pagesFontLine("lora", "fontLora"))
    expect(app.match(GLOBAL_STYLE)).toHaveLength(1)
  })
})

describe("apply goes back to the suiss theme", () => {
  it("restores the suiss colors, the default radius and the primary", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    const original = read(cwd, "src/index.css")
    await apply({
      cwd,
      yes: true,
      only: "theme",
      preset: preset({ baseColor: "zinc", theme: "zinc", radius: "large" }),
      primary: "#e11d48",
    })
    const themed = read(cwd, "src/index.css")
    expect(themed).toContain("--background: oklch(0.99 0 0);")
    expect(themed).toContain("--radius: 0.875rem;")
    expect(themed).toContain("--primary: oklch(0.5858 0.222 17.58);")
    await apply({ cwd, only: "theme", preset: SUISS, theme: "suiss" })
    expect(read(cwd, "src/index.css")).toBe(original)
  })

  it("only reports an update when the stylesheet changes", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    await apply({ cwd, only: "theme", preset: SUISS, theme: "suiss" })
    expect(output()).toContain("src/index.css already matches")
    expect(output()).not.toContain("Updated src/index.css")
  })

  it("keeps the suiss grays under a colored theme with --theme suiss", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    await apply({
      cwd,
      only: "theme",
      preset: preset({ theme: "blue" }),
      theme: "suiss",
    })
    const css = read(cwd, "src/index.css")
    expect(css).toContain("--primary: oklch(0.488 0.243 264.376);")
    expect(css).toContain("--background: oklch(1 0 0);")
  })
})

describe("menu accent", () => {
  it("points the menu accent at the primary color when it is bold", () => {
    const source = '"cn-menu-target cn-menu-translucent z-50"'
    expect(applyMenuColor(source, "default", "bold")).toBe(
      `"${BOLD_ACCENT} z-50"`
    )
    expect(applyMenuColor(source, "inverted", "bold")).toBe(
      `"dark ${BOLD_ACCENT} z-50"`
    )
    expect(applyMenuColor(source, "default", "subtle")).toBe('"z-50"')
  })

  it("keeps the translucent fill ahead of a later popover background", () => {
    const output = applyMenuColor(
      '"cn-menu-translucent bg-popover"',
      "default-translucent"
    )
    expect(output).toContain(" bg-popover/70! ")
    expect(output.endsWith(' bg-popover"')).toBe(true)
  })

  it("only adds the aria translucent highlight to translucent menus", () => {
    const source = '"cn-menu-translucent-aria relative"'
    expect(applyMenuColor(source, "default")).toBe('"relative"')
    expect(applyMenuColor(source, "default-translucent")).toContain(
      "**:data-[slot$=-item]:data-focused:bg-foreground/10 relative"
    )
  })

  it("writes the bold accent into menus from init and add", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, preset: preset({ menuAccent: "bold" }) })
    expect(JSON.parse(read(cwd, "components.json")).menuAccent).toBe("bold")
    await add(["dropdown-menu"], { cwd })
    expect(read(cwd, "src/components/ui/dropdown-menu.tsx")).toContain(
      `className="${BOLD_ACCENT} z-50"`
    )
  })
})

describe("init on a set-up project", () => {
  it("saves the base color of the preset in components.json", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({
      cwd,
      yes: true,
      preset: preset({ baseColor: "stone", theme: "blue" }),
    })
    expect(JSON.parse(read(cwd, "components.json")).tailwind.baseColor).toBe(
      "stone"
    )
  })

  it("keeps the styles that add appended to the stylesheet", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    await add(["theme"], { cwd })
    expect(read(cwd, "src/index.css")).toContain("@keyframes theme-reveal")
    await init({ cwd, yes: true })
    expect(read(cwd, "src/index.css")).toContain("@keyframes theme-reveal")
  })

  it("restyles the installed components when a preset changes their style", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    await add(["dropdown-menu"], { cwd })
    expect(read(cwd, "src/components/ui/dropdown-menu.tsx")).toContain(
      'className="z-50"'
    )
    await init({
      cwd,
      yes: true,
      preset: preset({ menuColor: "inverted" }),
    })
    expect(read(cwd, "src/components/ui/dropdown-menu.tsx")).toContain(
      'className="dark z-50"'
    )
  })

  it("warns when --style replaces the style of the preset", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, style: "vega", preset: preset() })
    expect(output()).toContain(
      "The preset uses the nova style, --style vega replaces it."
    )
    expect(JSON.parse(read(cwd, "components.json")).style).toBe("base-vega")
  })

  it("does not warn for --style suiss, which the create page adds", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true, style: "suiss", preset: preset() })
    expect(output()).not.toContain("replaces it")
  })
})

describe("add with kept files", () => {
  it("does not install the packages of items it did not write", async () => {
    const cwd = viteProject({ "vite.config.ts": viteConfig })
    await init({ cwd, yes: true })
    writeFileSync(
      path.join(cwd, "src/components/ui/dropdown-menu.tsx"),
      "edited\n"
    )
    vi.mocked(spawnSync).mockClear()
    await add(["dropdown-menu"], { cwd })
    expect(installed()).not.toContain("menu-only-package")
    expect(output()).toContain("Kept 1 local file")
  })
})
