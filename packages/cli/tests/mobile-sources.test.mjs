import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const MOBILE = path.join(import.meta.dirname, "../../mobile")
const STYLINGS = ["uniwind", "nativewind", "stylesheet"]
const LOCAL_IMPORT =
  /from\s+"@\/components\/(ui|patterns|interactions|blocks|charts|primitives)\/([\w-]+)"/g
const RELATIVE_IMPORT = /from\s+"\.\/([\w-]+)"/g
const TS_FILE = /\.tsx?$/
const UNTYPED_TIMER = /new Promise\(\(resolve\)\s*=>\s*setTimeout\(resolve\b/

function registryOf(styling) {
  return JSON.parse(
    readFileSync(
      path.join(MOBILE, "registry", styling, "registry.json"),
      "utf8"
    )
  )
}

function localImports(item, code, styling) {
  const names = [...code.matchAll(LOCAL_IMPORT)].map(([, group, name]) => {
    if (group === "primitives") return `primitives-${name}`
    if (group === "ui" && name === "theme") {
      return styling === "stylesheet" ? "theme-suiss" : "theme"
    }
    return name
  })
  const siblings = item.name.startsWith("primitives-")
    ? [...code.matchAll(RELATIVE_IMPORT)].map(
        ([, name]) => `primitives-${name}`
      )
    : []
  return [...names, ...siblings].filter(
    (name) =>
      name !== item.name &&
      !(item.name.startsWith("theme") && name.startsWith("theme"))
  )
}

function sourcesOf(directory) {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (TS_FILE.test(file)) found.push(file)
    }
  }
  walk(path.join(MOBILE, directory))
  return found
}

describe("the standard React Native registries", () => {
  it.each(STYLINGS)(
    "list every local import of a %s item as a registry dependency",
    (styling) => {
      const registry = registryOf(styling)
      const missing = registry.items.flatMap((item) => {
        const listed = new Set(
          (item.registryDependencies ?? []).map((name) =>
            name.replace("@esuiss/", "")
          )
        )
        return (item.files ?? [])
          .filter((file) => TS_FILE.test(file.path))
          .flatMap((file) =>
            localImports(
              item,
              readFileSync(path.join(MOBILE, file.path), "utf8"),
              styling
            )
          )
          .filter((name) => !listed.has(name))
          .map((name) => `${item.name} -> ${name}`)
      })
      expect(missing).toEqual([])
    }
  )

  it("give the StyleSheet themes the primitives they import", () => {
    const themes = registryOf("stylesheet").items.filter((item) =>
      item.name.startsWith("theme-")
    )
    expect(themes.length).toBeGreaterThan(1)
    for (const theme of themes) {
      expect(theme.registryDependencies).toEqual(
        expect.arrayContaining([
          "@esuiss/primitives-hooks",
          "@esuiss/primitives-portal",
          "@esuiss/primitives-toggle",
          "@esuiss/primitives-toggle-group",
        ])
      )
    }
  })
})

describe("React Native sources", () => {
  it.each([...STYLINGS.map((styling) => `${styling}/components`), "examples"])(
    "type the timer promises in %s for the React Native timer types",
    (directory) => {
      const untyped = sourcesOf(directory).filter((file) =>
        UNTYPED_TIMER.test(readFileSync(file, "utf8"))
      )
      expect(untyped).toEqual([])
    }
  )
})
