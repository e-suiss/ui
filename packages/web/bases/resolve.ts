import { statSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

const EXTENSIONS = ["", ".tsx", ".ts"]

function isFile(file: string) {
  return statSync(file, { throwIfNoEntry: false })?.isFile() ?? false
}

export function resolveBase(root: string, base: string): Plugin {
  const dir = path.join(root, "bases", base)

  function locate(source: string, importer: string | undefined) {
    if (source.startsWith("@/")) return path.join(root, source.slice(2))
    if (source.startsWith(".") && importer)
      return path.resolve(path.dirname(importer), source)
    return source
  }

  return {
    name: `resolve-base-${base}`,
    enforce: "pre",
    resolveId(source, importer) {
      const file = locate(source.split("?")[0] ?? source, importer)
      if (!path.isAbsolute(file) || !file.startsWith(root)) return null
      if (file.startsWith(dir)) return null
      const relative = path.relative(root, file)
      for (const extension of EXTENSIONS) {
        const twin = path.join(dir, relative + extension)
        if (isFile(twin)) return twin
      }
      return null
    },
  }
}
