export function toTitle(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function packageName(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

const IMPORT = /(?:from\s+|import\s+)["']([^"']+)["']/g

export function collectImports(code) {
  const specifiers = new Set()
  for (const match of code.matchAll(IMPORT)) specifiers.add(match[1])
  return [...specifiers]
}
