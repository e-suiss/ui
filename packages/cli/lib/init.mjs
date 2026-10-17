import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { installItems } from "./add.mjs"
import { CliError, confirm, note, step } from "./output.mjs"
import {
  configuredStylesheet,
  detectBase,
  detectProject,
  detectStyle,
  findAliasRoot,
  findStylesheet,
  install,
  saveBase,
  VITE_STYLESHEET,
} from "./project.mjs"
import { fetchRegistry, fetchStylesheet } from "./registry.mjs"
import { ensureAlias, relative } from "./shared/project.mjs"

const NEXT_APP_DIRS = ["src/app", "app"]
const VITE_CONFIGS = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
]
const POSTCSS_CONFIGS = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.ts",
]
const POSTCSS_CONFIG = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
`
const TOOLING = {
  next: ["tailwindcss", "@tailwindcss/postcss"],
  vite: ["tailwindcss", "@tailwindcss/vite", "@types/node"],
}
const MINIMUM_TAILWIND = [4, 2]
const FONT_IMPORT = '@import "@fontsource-variable/inter";\n'
const FONT_FAMILY =
  '--font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;'
const NEXT_FONT_FAMILY =
  "--font-sans: -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif;"
const NEXT_LAYOUTS = [
  "src/app/layout.tsx",
  "app/layout.tsx",
  "src/app/layout.jsx",
  "app/layout.jsx",
]
const NEXT_FONT_NOTE =
  'Load the fonts in your root layout with next/font/google: Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" }), and add its .variable value to the <html> className.'

const VERSION_NUMBER = /(\d+)(?:\.(\d+))?/
const VITE_PLUGINS = /plugins\s*:\s*\[/
const VITE_ALIAS = /["']@["']\s*:/
const VITE_DEFINE_CONFIG = /defineConfig\(\{/
const VITE_RESOLVE = /\bresolve\s*:/
const INTER_VARIABLE = /variable:\s*["']--font-inter["']/
const HTML_TAG = /<html\b[^>]*>/
const CLASSNAME_LITERAL = /className="([^"]*)"/
const CLASSNAME_TEMPLATE = /className=\{`([^`]*)`\}/
const TURBOPACK_TAILWIND = /@tailwindcss\/turbopack/
const NEXT_CONFIGS = ["next.config.ts", "next.config.mjs", "next.config.js"]
const CLASSNAME_ATTRIBUTE = /className=/
const HTML_TAG_START = /<html\b/
const SEMICOLON_IMPORT = /from\s+["'][^"']+["'];/
const NEXT_FONT_IMPORT =
  /import\s*\{([^}]*)\}\s*from\s*["']next\/font\/google["']/

const VITE_ENTRIES = [
  "src/main.tsx",
  "src/main.jsx",
  "src/main.ts",
  "src/main.js",
]
const REGEXP_SPECIAL = /[.*+?^${}()|[\]\\]/g

function stylesheetPath(project) {
  const configured = configuredStylesheet(project.cwd)
  if (configured) return configured
  if (project.framework === "vite")
    return path.join(project.cwd, VITE_STYLESHEET)
  const existing = findStylesheet(project)
  if (existing) return existing
  const appDir = NEXT_APP_DIRS.map((dir) => path.join(project.cwd, dir)).find(
    existsSync
  )
  if (!appDir)
    throw new CliError("Could not find the app directory (app/ or src/app/).")
  return path.join(appDir, "globals.css")
}

function installedVersion(project, name) {
  const manifest = path.join(project.cwd, "node_modules", name, "package.json")
  if (existsSync(manifest)) {
    return JSON.parse(readFileSync(manifest, "utf8")).version
  }
  return project.packages[name]
}

function assertTailwindVersion(project) {
  const version = installedVersion(project, "tailwindcss")
  const match = version?.match(VERSION_NUMBER)
  if (!match) return
  const major = Number(match[1])
  const minor = match[2] === undefined ? undefined : Number(match[2])
  const [requiredMajor, requiredMinor] = MINIMUM_TAILWIND
  const tooOld =
    major < requiredMajor ||
    (major === requiredMajor && minor !== undefined && minor < requiredMinor)
  if (tooOld) {
    throw new CliError(
      `Tailwind CSS ${requiredMajor}.${requiredMinor} or later is required, this project uses ${version}. Upgrade tailwindcss and run init again.`
    )
  }
}

function stylesheetPackages(css) {
  return [...css.matchAll(/@import\s+["']([^"']+)["']/g)]
    .map(([, specifier]) => specifier)
    .filter(
      (specifier) =>
        !specifier.startsWith(".") &&
        !specifier.startsWith("/") &&
        specifier !== "tailwindcss"
    )
    .map((specifier) => {
      const parts = specifier.split("/")
      return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
    })
}

function configureVite(project) {
  const file = VITE_CONFIGS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
  if (!file)
    return [
      "Create a vite.config.ts with the tailwindcss() plugin and an @ alias to ./src.",
    ]

  let text = readFileSync(file, "utf8")
  const original = text
  const manual = []

  if (!text.includes("@tailwindcss/vite")) {
    if (VITE_PLUGINS.test(text)) {
      text = text.replace(VITE_PLUGINS, (match) => `${match}tailwindcss(), `)
      text = `import tailwindcss from "@tailwindcss/vite"\n${text}`
    } else {
      manual.push(
        `Add tailwindcss() from "@tailwindcss/vite" to the plugins in ${relative(project, file)}.`
      )
    }
  }

  if (!VITE_ALIAS.test(text)) {
    if (VITE_DEFINE_CONFIG.test(text) && !VITE_RESOLVE.test(text)) {
      text = text.replace(
        VITE_DEFINE_CONFIG,
        (match) =>
          `${match}\n  resolve: {\n    alias: {\n      "@": fileURLToPath(new URL("./src", import.meta.url)),\n    },\n  },`
      )
      text = `import { fileURLToPath } from "node:url"\n${text}`
    } else {
      manual.push(
        `Add an "@" alias pointing to ./src in ${relative(project, file)}.`
      )
    }
  }

  if (text !== original) {
    writeFileSync(file, text)
    step(`Configured ${relative(project, file)}`)
  }
  return manual
}

function stylesheetFor(project, css) {
  if (project.framework !== "next") return css
  return css.replace(FONT_IMPORT, "").replace(FONT_FAMILY, NEXT_FONT_FAMILY)
}

function fontClassName(extra) {
  return `className={\`\${fontInter.variable}${extra}\`}`
}

function configureNextFont(project) {
  const file = NEXT_LAYOUTS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
  if (!file) return [NEXT_FONT_NOTE]

  let text = readFileSync(file, "utf8")
  if (INTER_VARIABLE.test(text)) return []

  const html = text.match(HTML_TAG)
  if (!html) return [NEXT_FONT_NOTE]
  let tag = html[0]
  const literal = tag.match(CLASSNAME_LITERAL)
  const template = tag.match(CLASSNAME_TEMPLATE)
  if (literal) {
    tag = tag.replace(literal[0], fontClassName(` ${literal[1]}`))
  } else if (template) {
    tag = tag.replace(template[0], fontClassName(` ${template[1]}`))
  } else if (!CLASSNAME_ATTRIBUTE.test(tag)) {
    tag = tag.replace(HTML_TAG_START, `<html ${fontClassName("")}`)
  } else {
    return [NEXT_FONT_NOTE]
  }
  text = text.replace(html[0], tag)

  const semi = SEMICOLON_IMPORT.test(text) ? ";" : ""
  const fontImport = text.match(NEXT_FONT_IMPORT)
  if (fontImport) {
    text = text.replace(
      fontImport[0],
      fontImport[0].replace(fontImport[1], `${fontImport[1].trimEnd()}, Inter `)
    )
  } else {
    text = `import { Inter } from "next/font/google"${semi}\n${text}`
  }

  const imports = [
    ...text.matchAll(/^import\s[\s\S]*?["'][^"']+["'];?[ \t]*\n/gm),
  ]
  const last = imports.at(-1)
  const at = last ? last.index + last[0].length : 0
  const declaration = `\nconst fontInter = Inter({\n  subsets: ["latin", "latin-ext"],\n  variable: "--font-inter",\n})${semi}\n`
  text = text.slice(0, at) + declaration + text.slice(at)

  writeFileSync(file, text)
  step(`Loaded Inter in ${relative(project, file)}`)
  return []
}

function usesTurbopackTailwind(project) {
  return NEXT_CONFIGS.map((name) => path.join(project.cwd, name)).some(
    (file) =>
      existsSync(file) && TURBOPACK_TAILWIND.test(readFileSync(file, "utf8"))
  )
}

function configureNext(project) {
  if (usesTurbopackTailwind(project)) return []
  const existing = POSTCSS_CONFIGS.map((name) =>
    path.join(project.cwd, name)
  ).find(existsSync)
  if (!existing) {
    writeFileSync(path.join(project.cwd, "postcss.config.mjs"), POSTCSS_CONFIG)
    step("Created postcss.config.mjs")
    return []
  }
  if (!readFileSync(existing, "utf8").includes("@tailwindcss/postcss")) {
    return [
      `Add "@tailwindcss/postcss" to the plugins in ${relative(project, existing)}.`,
    ]
  }
  return []
}

function importsStylesheet(project, stylesheet) {
  const name = path.basename(stylesheet).replace(REGEXP_SPECIAL, "\\$&")
  const statement = new RegExp(`import\\s+["'][^"']*\\b${name}["']`)
  const entries = project.framework === "next" ? NEXT_LAYOUTS : VITE_ENTRIES
  return entries
    .map((file) => path.join(project.cwd, file))
    .some(
      (file) => existsSync(file) && statement.test(readFileSync(file, "utf8"))
    )
}

function rememberBase(project, base, stylesheet, style) {
  const saved = saveBase(project, base, stylesheet, style)
  if (!saved) return []
  if (saved.invalid) {
    return [
      `Could not read ${relative(project, saved.file)}. Set its style to ${base}-suiss so add keeps using the ${base} base.`,
    ]
  }
  step(
    `${saved.created ? "Created" : "Updated"} ${relative(project, saved.file)} with the ${saved.style} style`
  )
  return []
}

export async function init(options) {
  const project = detectProject(options.cwd)
  assertTailwindVersion(project)

  const sourceRoot = existsSync(path.join(project.cwd, "src"))
    ? path.join(project.cwd, "src")
    : project.cwd
  if (project.framework === "vite" && sourceRoot === project.cwd) {
    throw new CliError("Expected a src/ directory in this Vite project.")
  }

  const stylesheet = stylesheetPath(project)
  const stylesheetExists = existsSync(stylesheet)
  if (
    stylesheetExists &&
    readFileSync(stylesheet, "utf8").trim() &&
    !options.yes
  ) {
    const replace = await confirm(
      `Replace ${relative(project, stylesheet)} with the suiss/ui stylesheet?`
    )
    if (!replace) {
      throw new CliError(
        "Cancelled. Run again with --yes to replace the stylesheet."
      )
    }
  }

  const base = options.base ?? detectBase(project.cwd)
  const style = options.style ?? detectStyle(project.cwd)
  const registry = await fetchRegistry(base)
  const css = stylesheetFor(project, await fetchStylesheet())

  const tsconfigs =
    project.framework === "vite"
      ? ["tsconfig.json", "tsconfig.app.json"]
      : ["tsconfig.json"]
  if (ensureAlias(project, sourceRoot, tsconfigs))
    step("Added the @/* import alias to tsconfig")

  install(project, TOOLING[project.framework], { dev: true })
  install(project, stylesheetPackages(css))

  const manual =
    project.framework === "vite"
      ? configureVite(project)
      : [...configureNext(project), ...configureNextFont(project)]

  mkdirSync(path.dirname(stylesheet), { recursive: true })
  writeFileSync(stylesheet, css)
  step(`Wrote ${relative(project, stylesheet)}`)
  if (options.base || options.style)
    manual.push(...rememberBase(project, base, stylesheet, options.style))
  if (!importsStylesheet(project, stylesheet)) {
    manual.push(
      `Import ${relative(project, stylesheet)} in ${project.framework === "next" ? "your root layout" : "src/main.tsx"}.`
    )
  }

  await installItems(
    project,
    findAliasRoot(project.cwd) ?? sourceRoot,
    registry,
    ["button"],
    { overwrite: options.overwrite, base, style }
  )

  for (const message of manual) note(message)
  step("Ready. Add components with npx @esuiss/ui add <name>")
}
