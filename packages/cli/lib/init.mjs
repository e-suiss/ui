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
const RUNTIME = ["tw-animate-css"]

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

function assertTailwindVersion(project) {
  const version = project.packages.tailwindcss
  const major = version && Number(version.match(/\d+/)?.[0])
  if (major && major < 4) {
    throw new CliError(
      `Tailwind CSS v4 is required, this project uses ${version}.`
    )
  }
}

function addAliasTo(file, target) {
  let text = readFileSync(file, "utf8")
  const alias = `"@/*": ["${target}"]`
  const paths = text.match(/"paths"\s*:\s*\{/)
  const options = text.match(/"compilerOptions"\s*:\s*\{/)
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
    if (/plugins\s*:\s*\[/.test(text)) {
      text = text.replace(
        /plugins\s*:\s*\[/,
        (match) => `${match}tailwindcss(), `
      )
      text = `import tailwindcss from "@tailwindcss/vite"\n${text}`
    } else {
      manual.push(
        `Add tailwindcss() from "@tailwindcss/vite" to the plugins in ${relative(project, file)}.`
      )
    }
  }

  if (!/["']@["']\s*:/.test(text)) {
    if (/defineConfig\(\{/.test(text) && !/\bresolve\s*:/.test(text)) {
      text = text.replace(
        /defineConfig\(\{/,
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

function configureNext(project) {
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
  const css = await fetchStylesheet(registry)

  if (ensureAlias(project, sourceRoot))
    step("Added the @/* import alias to tsconfig")

  install(project, TOOLING[project.framework], { dev: true })
  install(project, RUNTIME)

  const manual =
    project.framework === "vite"
      ? configureVite(project)
      : configureNext(project)

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
