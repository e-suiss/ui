import { readFileSync, writeFileSync } from "node:fs"

import { iconPackages, toIcons, usesIconPlaceholders } from "./icons.mjs"
import { CliError, note, step } from "./output.mjs"
import {
  detectBase,
  detectIcons,
  detectMenuColor,
  detectProject,
  detectStyle,
  findAliasRoot,
  findStylesheet,
  install,
} from "./project.mjs"
import {
  checkCss,
  fetchRegistry,
  fetchStyles,
  fetchText,
  resolveItems,
  toCss,
} from "./registry.mjs"
import {
  mapLimit,
  printDiff,
  reportFiles,
  targetFor,
  writeFiles,
} from "./shared/files.mjs"
import { relative } from "./shared/project.mjs"
import { chooseNames } from "./shared/select.mjs"
import {
  applyMenuColor,
  applyStyleMap,
  composeStyleMap,
  DEFAULT_STYLE,
  styleMarkers,
} from "./styles.mjs"

const COMMENT = /\/\*[\s\S]*?\*\//g
const WHITESPACE = /\s+/g
const AROUND_PUNCTUATION = /\s*([{};,>])\s*/g
const SINGLE_QUOTE = /'/g
const RULE_HEAD_END = /[{;]/

const scopeOf = (item) => item.scope

async function styled(source, { base = "base", style = DEFAULT_STYLE }) {
  if (styleMarkers(source).length === 0) return source
  const map = composeStyleMap(await fetchStyles(), base, style)
  const { output, unknown } = applyStyleMap(source, map)
  if (unknown.length) {
    throw new CliError(`Unknown style markers: ${unknown.join(", ")}`)
  }
  return output
}

function fetchFiles(root, items, styling = {}) {
  const files = items.flatMap((item) =>
    item.files.map((file, index) => ({
      file,
      source: item.sources?.[index] ?? file,
      target: targetFor(root, file),
    }))
  )
  return mapLimit(files, async (entry) => {
    const source = applyMenuColor(
      await styled(await fetchText(entry.source), styling),
      styling.menuColor
    )
    return {
      ...entry,
      content: toIcons(source, styling.icons),
      icons: usesIconPlaceholders(source),
    }
  })
}

function normalizeCss(css) {
  return css
    .replace(COMMENT, "")
    .replace(SINGLE_QUOTE, '"')
    .replace(WHITESPACE, " ")
    .replace(AROUND_PUNCTUATION, "$1")
    .trim()
}

function hasRule(css, rule) {
  const normalized = normalizeCss(rule)
  const head = normalized.slice(0, normalized.search(RULE_HEAD_END) + 1)
  return (
    css.startsWith(head) ||
    ["}", ";", "{"].some((before) => css.includes(`${before}${head}`))
  )
}

function addStyles(project, items) {
  const styled = items.filter((item) => item.css)
  if (!styled.length) return
  const names = styled.map((item) => item.name).join(", ")
  const rules = styled.flatMap((item) => toCss(item.css))
  const file = findStylesheet(project)
  if (!file) {
    note(
      `Add the styles for ${names} to your stylesheet:\n\n${rules.join("\n\n")}`
    )
    return
  }
  const current = readFileSync(file, "utf8")
  const normalized = normalizeCss(current)
  const missing = rules.filter((rule) => !hasRule(normalized, rule))
  if (!missing.length) return
  writeFileSync(file, `${current.trimEnd()}\n\n${missing.join("\n\n")}\n`)
  step(`Added the styles for ${names} to ${relative(project, file)}`)
}

export async function installItems(
  project,
  root,
  registry,
  names,
  { overwrite = false, base, style, icons, menuColor } = {}
) {
  const items = resolveItems(registry, names)
  for (const item of items) checkCss(item)
  const files = await fetchFiles(root, items, { base, style, icons, menuColor })
  const result = writeFiles(project.cwd, files, overwrite)
  const installed = install(project, [
    ...items.flatMap((item) => item.dependencies),
    ...(files.some((file) => file.icons) ? iconPackages(icons) : []),
  ])
  reportFiles(result, installed)
  addStyles(project, items)
}

async function showDiff(project, root, registry, names, styling) {
  printDiff(
    project.cwd,
    await fetchFiles(root, resolveItems(registry, names), styling)
  )
}

export async function add(names, options) {
  const project = detectProject(options.cwd)
  const root = findAliasRoot(project.cwd)
  if (!root) {
    throw new CliError(
      'No "@/*" import alias found in tsconfig.json. Run `npx @esuiss/ui init` first.'
    )
  }

  const base = options.base ?? detectBase(project.cwd)
  const style = options.style ?? detectStyle(project.cwd)
  const styling = {
    base,
    style,
    icons: detectIcons(project.cwd),
    menuColor: detectMenuColor(project.cwd),
  }
  const registry = await fetchRegistry(base)
  const selected = await chooseNames(registry.items, names, options, {
    scopeOf,
  })

  if (options.diff) {
    await showDiff(project, root, registry, selected, styling)
  } else {
    await installItems(project, root, registry, selected, {
      ...options,
      ...styling,
    })
  }
}
