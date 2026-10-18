import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { step } from "./output.mjs"
import { relative } from "./shared/project.mjs"

const DEFAULT_FONT = "inter"
const INHERIT = "inherit"

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
export const NEXT_PAGES_APPS = [
  "src/pages/_app.tsx",
  "pages/_app.tsx",
  "src/pages/_app.jsx",
  "pages/_app.jsx",
]

const FONT_SANS = /--font-sans:[^;]*;/
const IMPORT_LINE = /^@import\s+["']([^"']+)["'][^;\n]*;[ \t]*\n/gm
const REGEXP_SPECIAL = /[.*+?^${}()|[\]\\]/g
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
const LATIN_ONLY = /subsets:\s*\[\s*["']latin["']\s*\]/
const EMPTY_CLASSNAME = / className=\{``\}/
const PAGES_RETURN = /return <Component \{\.\.\.pageProps\} \/>(;?)/
const PAGES_FONT_LINE =
  /--font-[a-z0-9-]+: \$\{font[A-Z]\w*\.style\.fontFamily\};/

function webFontOf(name) {
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

export function presetWebFont(preset) {
  const font = webFontOf(preset.font)
  if (!font || font.name !== DEFAULT_FONT) return font
  const explicit = Boolean(preset.fontHeading) && preset.fontHeading !== INHERIT
  return explicit ? { ...font, explicit } : font
}

function isDefault(font) {
  return !font || (font.name === DEFAULT_FONT && !font.explicit)
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

function pagesFontNote(font) {
  return `Load the font in pages/_app with next/font/google: const ${font.id} = ${font.loader}({ subsets: ["latin", "latin-ext"], variable: "${font.variable}" }), and set ${font.variable}: \${${font.id}.style.fontFamily} on :root in a <style jsx global> block.`
}

function pagesFontLine(font) {
  return `${font.variable}: \${${font.id}.style.fontFamily};`
}

function pagesReturn(font, semi) {
  return `return (
    <>
      <style jsx global>{\`
        :root {
          ${pagesFontLine(font)}
        }
      \`}</style>
      <Component {...pageProps} />
    </>
  )${semi}`
}

function configurePagesFont(project, file, font) {
  const original = readFileSync(file, "utf8")
  const semi = SEMICOLON_IMPORT.test(original) ? ";" : ""
  let text = original
  const managed = text.match(MANAGED_FONT)
  if (managed) {
    const [block, , loader, name] = managed
    if (name === font.name) return []
    if (!PAGES_FONT_LINE.test(text)) return [pagesFontNote(font)]
    text = text.replace(block, "").replace(PAGES_FONT_LINE, pagesFontLine(font))
    if (!new RegExp(`\\b${loader}\\(`).test(text)) {
      text = withImports(
        text,
        importedNames(text).filter((imported) => imported !== loader),
        semi
      )
    }
  } else if (declarationOf(text, font)) {
    return []
  } else {
    const found = text.match(PAGES_RETURN)
    if (!found) return [pagesFontNote(font)]
    text = text.replace(found[0], pagesReturn(font, found[1]))
  }
  const names = importedNames(text)
  if (!names.includes(font.loader)) {
    text = withImports(text, [...names, font.loader], semi)
  }
  text = insertDeclaration(text, font, semi)
  if (text === original) return []
  writeFileSync(file, text)
  step(`Loaded ${font.title} in ${relative(project, file)}`)
  return []
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

function declarationOf(text, font) {
  const variable = font.variable.replace(REGEXP_SPECIAL, "\\$&")
  return text.match(
    new RegExp(`\\b\\w+\\(\\{[^}]*?variable:\\s*["']${variable}["'][^}]*\\}\\)`)
  )?.[0]
}

function withLatinExt(text, font) {
  const found = declarationOf(text, font)
  if (!found || !LATIN_ONLY.test(found)) return text
  return text.replace(
    found,
    found.replace(LATIN_ONLY, 'subsets: ["latin", "latin-ext"]')
  )
}

function withoutClassName(text, id) {
  const reference = `\${${id}.variable}`
  return text
    .replace(`${reference} `, "")
    .replace(` ${reference}`, "")
    .replace(reference, "")
    .replace(EMPTY_CLASSNAME, "")
}

export function configureNextFont(project, font) {
  const resolved = font ?? webFontOf(DEFAULT_FONT)
  const file = NEXT_LAYOUTS.map((name) => path.join(project.cwd, name)).find(
    existsSync
  )
  if (!file) {
    const pages = NEXT_PAGES_APPS.map((name) =>
      path.join(project.cwd, name)
    ).find(existsSync)
    return pages
      ? configurePagesFont(project, pages, resolved)
      : [fontNote(resolved)]
  }

  const original = readFileSync(file, "utf8")
  const semi = SEMICOLON_IMPORT.test(original) ? ";" : ""
  let text = original
  const managed = text.match(MANAGED_FONT)

  let declare = true
  if (managed) {
    const [block, id, loader, name] = managed
    if (name === resolved.name) return []
    text = text.replace(block, "")
    if (declarationOf(text, resolved)) {
      declare = false
      text = withoutClassName(text, id)
    } else {
      text = text.replaceAll(
        `\${${id}.variable}`,
        `\${${resolved.id}.variable}`
      )
    }
    if (!new RegExp(`\\b${loader}\\(`).test(text)) {
      text = withImports(
        text,
        importedNames(text).filter((imported) => imported !== loader),
        semi
      )
    }
  } else if (declarationOf(text, resolved)) {
    declare = false
  } else {
    const withClass = addClassName(text, resolved)
    if (!withClass) return [fontNote(resolved)]
    text = withClass
  }

  if (declare) {
    const names = importedNames(text)
    if (!names.includes(resolved.loader)) {
      text = withImports(text, [...names, resolved.loader], semi)
    }
    text = insertDeclaration(text, resolved, semi)
  } else {
    text = withLatinExt(text, resolved)
  }

  if (text === original) return []
  writeFileSync(file, text)
  step(`Loaded ${resolved.title} in ${relative(project, file)}`)
  return []
}
