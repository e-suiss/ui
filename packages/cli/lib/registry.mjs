import { CliError } from "./output.mjs"
import { createRegistry } from "./shared/registry.mjs"

export { resolveItems } from "./shared/registry.mjs"

const NAMESPACE = "@esuiss/"
const STYLESHEET = "styles/globals.css"
const BASE_FOLDER = /^bases\/[^/]+\//
const AT_RULE = /^\s*@([a-z-]+)/
const AT_RULES = [
  "apply",
  "container",
  "custom-variant",
  "import",
  "keyframes",
  "layer",
  "media",
  "plugin",
  "property",
  "supports",
  "theme",
  "utility",
]
const IMPORT = /^@(?:import|plugin)\s+(?:"([^"]+)"|'([^']+)')$/
const MODULE_SPECIFIER =
  /^(?:@[a-z0-9~][\w.~-]*\/)?[a-z0-9~][\w.~-]*(?:\/(?!\.\.?(?:\/|$))[\w.~-]+)*$/i
const DATA_URL = /url\(\s*(?:'data:[^']*'|"data:[^"]*"|data:[^)'"\s]*)\s*\)/gi
const URL_FUNCTION = /\burl\(|\bimage-set\(|\bsrc\(/i
const REMOTE = /(?:^|["'(\s,])(?:[a-z][a-z0-9+.-]*:\/\/|\/\/)/i
const BLOCK = /[{};]/
const ESCAPE_OR_COMMENT = /\\|\/\*|\*\//
const COMMENT = /\/\*[\s\S]*?\*\//g
const REMOTE_IMPORT = /@import\s*(?:url\(|["']\s*(?:[a-z][a-z0-9+.-]*:|\/\/))/i
const LOADING_FUNCTION = /\b(?:url|src|image-set)\(([^;{}]*)/gi
const REMOTE_ARGUMENT = /(?:^|["'(\s,])(?:[a-z][a-z0-9+.-]*:|\/\/)/i
const VALUE_BLOCK = /[{}]/
const THEME_NAME = /^[a-z0-9-]+$/
const THEME_VALUE = /^[a-z0-9\s().,%#/+-]+$/i
const THEME_UNSAFE = /\/\/|\/\*|\burl\(/i
const UNLISTED_TYPES = ["registry:hook", "registry:lib"]
const INDEXES = {
  base: "registry/registry.json",
  radix: "registry/radix/registry.json",
  aria: "registry/aria/registry.json",
}

export const BASES = Object.keys(INDEXES)

const registry = createRegistry({
  base: "https://raw.githubusercontent.com/e-suiss/ui/{ref}/packages/web",
  env: "ESUISS_REGISTRY",
})

export const { fetchText } = registry
const { fetchJson } = registry

export const SCOPES = {
  ui: {
    kind: "component",
    label: "Components",
    command: "add",
    example: "button",
  },
  pattern: {
    kind: "pattern",
    label: "Patterns",
    command: "add patterns",
    example: "<name>",
    directory: "components/patterns/",
  },
  interaction: {
    kind: "interaction",
    label: "Interactions",
    command: "add interactions",
    example: "<name>",
    directory: "components/interactions/",
  },
  chart: {
    kind: "chart",
    label: "Charts",
    command: "add charts",
    example: "<name>",
    directory: "components/charts/",
  },
  block: {
    kind: "block",
    label: "Blocks",
    command: "add blocks",
    example: "<name>",
    directory: "components/blocks/",
  },
}

function scopeOfFile(file = "") {
  const entry = Object.entries(SCOPES).find(
    ([, { directory }]) => directory && file.startsWith(directory)
  )
  return entry ? entry[0] : "ui"
}

function validItem(item) {
  return (
    item &&
    typeof item.name === "string" &&
    Array.isArray(item.files) &&
    item.files.every((file) => typeof file?.path === "string") &&
    (item.registryDependencies === undefined ||
      (Array.isArray(item.registryDependencies) &&
        item.registryDependencies.every((name) => typeof name === "string"))) &&
    (item.dependencies === undefined ||
      (Array.isArray(item.dependencies) &&
        item.dependencies.every((name) => typeof name === "string")))
  )
}

function toItem(item) {
  if (!validItem(item)) {
    const name = typeof item?.name === "string" ? item.name : "an item"
    throw new CliError(
      `The registry entry for ${name} is malformed. Update @esuiss/ui or check ESUISS_REGISTRY.`
    )
  }
  const sources = item.files.map((file) => file.path)
  const files = sources.map((source) => source.replace(BASE_FOLDER, ""))
  return {
    name: item.name,
    scope: scopeOfFile(files[0]),
    requires: (item.registryDependencies ?? []).map((name) =>
      name.startsWith(NAMESPACE) ? name.slice(NAMESPACE.length) : name
    ),
    dependencies: item.dependencies ?? [],
    files,
    ...(sources.some((source, index) => source !== files[index]) && {
      sources,
    }),
    ...(item.css && { css: item.css }),
    ...(item.meta?.optIn && { optIn: true }),
    ...(UNLISTED_TYPES.includes(item.type) && { listed: false }),
  }
}

export async function fetchRegistry(base = "base") {
  const { items } = await fetchJson(INDEXES[base])
  if (!Array.isArray(items)) {
    throw new CliError(`${INDEXES[base]} has no item list.`)
  }
  return {
    items: items
      .filter((item) => item?.files != null && item.files.length !== 0)
      .map(toItem),
  }
}

let styles

function checkThemes(themes) {
  if (!Array.isArray(themes)) {
    throw new CliError("Refusing registry/themes.json: it is not a list.")
  }
  for (const theme of themes) {
    for (const mode of ["light", "dark"]) {
      for (const [name, value] of Object.entries(theme?.[mode] ?? {})) {
        if (
          !THEME_NAME.test(name) ||
          typeof value !== "string" ||
          !THEME_VALUE.test(value) ||
          THEME_UNSAFE.test(value)
        ) {
          throw new CliError(
            `Refusing registry/themes.json: --${name} is not a plain color or size.`
          )
        }
      }
    }
  }
  return themes
}

export async function fetchThemes() {
  return checkThemes(await fetchJson("registry/themes.json"))
}

export function fetchStyles() {
  styles ??= fetchJson("registry/styles.json")
  return styles
}

function loadsRemote(css) {
  return [css, css.replace(COMMENT, "")].some((text) => {
    const rest = text.replace(DATA_URL, "")
    return (
      REMOTE_IMPORT.test(rest) ||
      [...rest.matchAll(LOADING_FUNCTION)].some(([, argument]) =>
        REMOTE_ARGUMENT.test(argument)
      )
    )
  })
}

export function checkStylesheet(css, file) {
  if (css.includes("\\")) {
    throw new CliError(
      `Refusing ${file}: it contains CSS escapes, which can hide what it loads.`
    )
  }
  if (loadsRemote(css)) {
    throw new CliError(
      `Refusing ${file}: it loads files from outside the project.`
    )
  }
  return css
}

export async function fetchStylesheet() {
  return checkStylesheet(await fetchText(STYLESHEET), STYLESHEET)
}

function unsafeCss(text, value) {
  const rest = text.replace(DATA_URL, "")
  return (
    ESCAPE_OR_COMMENT.test(text) ||
    URL_FUNCTION.test(rest) ||
    REMOTE.test(rest) ||
    (value ? VALUE_BLOCK : BLOCK).test(rest)
  )
}

function unsafeRule(selector, body) {
  const atRule = selector.match(AT_RULE)?.[1]
  if (atRule && !AT_RULES.includes(atRule)) return selector
  if (atRule === "import" || atRule === "plugin") {
    const [, double, single] = selector.match(IMPORT) ?? []
    const specifier = double ?? single
    const empty = body && typeof body === "object" && !Object.keys(body).length
    return specifier && MODULE_SPECIFIER.test(specifier) && empty
      ? null
      : selector
  }
  if (unsafeCss(selector, false)) return selector
  if (typeof body === "string") return unsafeCss(body, true) ? body : null
  if (!body || typeof body !== "object") return selector
  for (const [key, value] of Object.entries(body)) {
    const unsafe = unsafeRule(key, value)
    if (unsafe) return unsafe
  }
  return null
}

export function checkCss(item) {
  if (!item.css) return
  const unsafe =
    typeof item.css === "object"
      ? Object.entries(item.css)
          .map(([selector, body]) => unsafeRule(selector, body))
          .find(Boolean)
      : String(item.css)
  if (unsafe) {
    throw new CliError(
      `Refusing the styles of ${item.name}: ${unsafe} can load files from outside the project or break out of its rule.`
    )
  }
}

function cssBlock(selector, body, indent) {
  const inner = Object.entries(body).map(([key, value]) =>
    typeof value === "string"
      ? `${indent}  ${key}: ${value};`
      : cssBlock(key, value, `${indent}  `)
  )
  return inner.length
    ? `${indent}${selector} {\n${inner.join("\n")}\n${indent}}`
    : `${indent}${selector};`
}

export function toCss(css) {
  return Object.entries(css).map(([selector, body]) =>
    cssBlock(selector, body, "")
  )
}
