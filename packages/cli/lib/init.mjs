import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { installItems } from "./add.mjs"
import { CliError, confirm, note, step } from "./output.mjs"
import { detectProject, findAliasRoot, install } from "./project.mjs"
import { fetchRegistry, fetchStylesheet } from "./registry.mjs"

const NEXT_STYLESHEETS = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
]
const NEXT_APP_DIRS = ["src/app", "app"]
const VITE_STYLESHEET = "src/index.css"
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
const TSCONFIG_PATHS = /"paths"\s*:\s*\{/
const TSCONFIG_COMPILER_OPTIONS = /"compilerOptions"\s*:\s*\{/
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

function relative(project, file) {
  return path.relative(project.cwd, file)
}

function findStylesheet(project) {
  if (project.framework === "vite")
    return path.join(project.cwd, VITE_STYLESHEET)
  const existing = NEXT_STYLESHEETS.map((file) =>
    path.join(project.cwd, file)
  ).find(existsSync)
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

function addAliasTo(file, target) {
  let text = readFileSync(file, "utf8")
  const alias = `"@/*": ["${target}"]`
  const paths = text.match(TSCONFIG_PATHS)
  const options = text.match(TSCONFIG_COMPILER_OPTIONS)
  if (paths) {
    text = text.replace(paths[0], `${paths[0]}\n      ${alias},`)
  } else if (options) {
    text = text.replace(
      options[0],
      `${options[0]}\n    "paths": {\n      ${alias}\n    },`
    )
  } else {
    text = text.replace(
      "{",
      `{\n  "compilerOptions": {\n    "paths": {\n      ${alias}\n    }\n  },`
    )
  }
  writeFileSync(file, text)
}

function ensureAlias(project, sourceRoot) {
  if (findAliasRoot(project.cwd)) return false
  const target =
    sourceRoot === project.cwd ? "./*" : `./${relative(project, sourceRoot)}/*`
  const files =
    project.framework === "vite"
      ? ["tsconfig.json", "tsconfig.app.json"]
      : ["tsconfig.json"]
  for (const name of files) {
    const file = path.join(project.cwd, name)
    if (existsSync(file)) addAliasTo(file, target)
  }
  return true
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

export async function init(options) {
  const project = detectProject(options.cwd)
  assertTailwindVersion(project)

  const sourceRoot = existsSync(path.join(project.cwd, "src"))
    ? path.join(project.cwd, "src")
    : project.cwd
  if (project.framework === "vite" && sourceRoot === project.cwd) {
    throw new CliError("Expected a src/ directory in this Vite project.")
  }

  const stylesheet = findStylesheet(project)
  const stylesheetExists = existsSync(stylesheet)
  if (
    stylesheetExists &&
    readFileSync(stylesheet, "utf8").trim() &&
    !options.yes
  ) {
    const replace = await confirm(
      `Replace ${relative(project, stylesheet)} with the esuiss-ui stylesheet?`
    )
    if (!replace) {
      throw new CliError(
        "Cancelled. Run again with --yes to replace the stylesheet."
      )
    }
  }

  const registry = await fetchRegistry()
  const css = stylesheetFor(project, await fetchStylesheet(registry))

  if (ensureAlias(project, sourceRoot))
    step("Added the @/* import alias to tsconfig")

  install(project, TOOLING[project.framework], { dev: true })
  install(project, stylesheetPackages(css))

  const manual =
    project.framework === "vite"
      ? configureVite(project)
      : [...configureNext(project), ...configureNextFont(project)]

  writeFileSync(stylesheet, css)
  step(`Wrote ${relative(project, stylesheet)}`)
  if (!stylesheetExists) {
    manual.push(
      `Import ${relative(project, stylesheet)} in ${project.framework === "next" ? "your root layout" : "src/main.tsx"}.`
    )
  }

  await installItems(
    project,
    findAliasRoot(project.cwd) ?? sourceRoot,
    registry,
    ["button"]
  )

  for (const message of manual) note(message)
  step("Ready. Add components with npx @esuiss/ui add <name>")
}
