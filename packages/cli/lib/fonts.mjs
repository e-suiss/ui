import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { step } from "./output.mjs"
import { relative } from "./shared/project.mjs"

const DEFAULT_FONT = "inter"

const fonts = JSON.parse(
  readFileSync(new URL("./fonts.json", import.meta.url), "utf8")
)

const VARIABLE_PACKAGE = "@fontsource-variable/"
const STATIC_WEIGHT = "400"
const FONT_PACKAGES = new Set(fonts.map((font) => font.dependency))
const DEFAULT_FAMILY =
  '--font-sans: -apple-system, BlinkMacSystemFont, "Inter Variable", sans-serif;'
const DEFAULT_NEXT_FAMILY =
  "--font-sans: -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif;"
export const NEXT_LAYOUTS = [
  "src/app/layout.tsx",
  "app/layout.tsx",
  "src/app/layout.jsx",
  "app/layout.jsx",
]

const FONT_SANS = /--font-sans:[^;]*;/
const IMPORT_LINE = /^@import\s+["']([^"']+)["'][^;\n]*;[ \t]*\n/gm
const DASH_LETTER = /(^|-)([a-z0-9])/g
const HTML_TAG = /<html\b[^>]*>/
const CLASSNAME_LITERAL = /className="([^"]*)"/
const CLASSNAME_TEMPLATE = /className=\{`([^`]*)`\}/
const CLASSNAME_ATTRIBUTE = /className=/
const HTML_TAG_START = /<html\b/
const SEMICOLON_IMPORT = /from\s+["'][^"']+["'];/
const NEXT_FONT_IMPORT =
  /import\s*\{([^}]*)\}\s*from\s*["']next\/font\/google["'];?[ \t]*\n?/
const MANAGED_FONT =
  /\n?const (font[A-Z]\w*) = (\w+)\(\{[^}]*?variable:\s*["']--font-([a-z0-9-]+)["'][^}]*\}\);?\n/
const IMPORTS = /^import\s[\s\S]*?["'][^"']+["'];?[ \t]*\n/gm
const SPECIFIER_SEPARATOR = /\s*,\s*/

export function webFontOf(name) {
  const font = fonts.find((entry) => entry.name === name)
  if (!font) return null
  const fallback = font.family.split(",").at(-1).trim()
  return {
    ...font,
    id: `font${font.name.replace(DASH_LETTER, (_, _dash, letter) => letter.toUpperCase())}`,
    loader: font.google,
    variable: `--font-${font.name}`,
    fallback,
    isVariable: font.dependency.startsWith(VARIABLE_PACKAGE),
  }
}

function isDefault(font) {
  return !font || font.name === DEFAULT_FONT
}

function familyLine(framework, font) {
  if (framework === "next") {
    return isDefault(font)
      ? DEFAULT_NEXT_FAMILY
      : `--font-sans: var(${font.variable}), ${font.fallback};`
  }
  return isDefault(font) ? DEFAULT_FAMILY : `--font-sans: ${font.family};`
}

export function withFont(css, framework, font) {
  if (!FONT_SANS.test(css)) return css
  const resolved = font ?? webFontOf(DEFAULT_FONT)
  const statement =
    framework === "next" ? "" : `@import "${resolved.dependency}";\n`
  let placed = false
  let text = css.replace(IMPORT_LINE, (line, specifier) => {
    if (!FONT_PACKAGES.has(specifier)) return line
    if (placed) return ""
    placed = true
    return statement
  })
  if (!placed && statement) {
    const last = [...text.matchAll(IMPORT_LINE)].at(-1)
    const at = last ? last.index + last[0].length : 0
    text = text.slice(0, at) + statement + text.slice(at)
  }
  return text.replace(FONT_SANS, familyLine(framework, resolved))
}

function fontNote(font) {
  return `Load the fonts in your root layout with next/font/google: ${font.loader}({ subsets: ["latin", "latin-ext"], variable: "${font.variable}" }), and add its .variable value to the <html> className.`
}

function declaration(font, semi) {
  const weight = font.isVariable ? "" : `\n  weight: "${STATIC_WEIGHT}",`
  return `\nconst ${font.id} = ${font.loader}({\n  subsets: ["latin", "latin-ext"],${weight}\n  variable: "${font.variable}",\n})${semi}\n`
}

function fontClassName(font, extra) {
  return `className={\`\${${font.id}.variable}${extra}\`}`
}

function addClassName(text, font) {
  const html = text.match(HTML_TAG)
  if (!html) return null
  let tag = html[0]
  const literal = tag.match(CLASSNAME_LITERAL)
  const template = tag.match(CLASSNAME_TEMPLATE)
  if (literal) {
    tag = tag.replace(literal[0], fontClassName(font, ` ${literal[1]}`))
  } else if (template) {
    tag = tag.replace(template[0], fontClassName(font, ` ${template[1]}`))
  } else if (!CLASSNAME_ATTRIBUTE.test(tag)) {
    tag = tag.replace(HTML_TAG_START, `<html ${fontClassName(font, "")}`)
  } else {
    return null
  }
  return text.replace(html[0], tag)
}

function importedNames(text) {
  const found = text.match(NEXT_FONT_IMPORT)
  if (!found) return []
  return found[1]
    .split(SPECIFIER_SEPARATOR)
    .map((name) => name.trim())
    .filter(Boolean)
}

function withImports(text, names, semi) {
  const found = text.match(NEXT_FONT_IMPORT)
  if (!names.length) return found ? text.replace(found[0], "") : text
  const statement = `import { ${names.join(", ")} } from "next/font/google"${semi}\n`
  return found ? text.replace(found[0], statement) : `${statement}${text}`
}

function insertDeclaration(text, font, semi) {
  const last = [...text.matchAll(IMPORTS)].at(-1)
  const at = last ? last.index + last[0].length : 0
  return text.slice(0, at) + declaration(font, semi) + text.slice(at)
}

export function configureNextFont(project, font) {
  const resolved = font ?? webFontOf(DEFAULT_FONT)
  const file = NEXT_LAYOUTS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
  if (!file) return [fontNote(resolved)]

  const original = readFileSync(file, "utf8")
  const semi = SEMICOLON_IMPORT.test(original) ? ";" : ""
  let text = original
  const managed = text.match(MANAGED_FONT)

  if (managed) {
    const [block, id, loader, name] = managed
    if (name === resolved.name) return []
    text = text.replace(block, "")
    text = text.replaceAll(`\${${id}.variable}`, `\${${resolved.id}.variable}`)
    if (!new RegExp(`\\b${loader}\\(`).test(text)) {
      text = withImports(
        text,
        importedNames(text).filter((imported) => imported !== loader),
        semi
      )
    }
  } else if (
    new RegExp(`variable:\\s*["']${resolved.variable}["']`).test(text)
  ) {
    return []
  } else {
    const withClass = addClassName(text, resolved)
    if (!withClass) return [fontNote(resolved)]
    text = withClass
  }

  const names = importedNames(text)
  if (!names.includes(resolved.loader)) {
    text = withImports(text, [...names, resolved.loader], semi)
  }
  text = insertDeclaration(text, resolved, semi)

  if (text === original) return []
  writeFileSync(file, text)
  step(`Loaded ${resolved.title} in ${relative(project, file)}`)
  return []
}
