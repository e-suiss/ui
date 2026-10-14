import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const limits = existsSync("size-limits.json")
  ? JSON.parse(readFileSync("size-limits.json", "utf8"))
  : {}
const ignore = ["react", "react-dom", "react/jsx-runtime"]

function check(name, path, extra = {}) {
  return {
    name,
    path,
    ignore,
    ...extra,
    gzip: true,
    ...(limits[name] && { limit: limits[name] }),
  }
}

const files = registry.items.flatMap((item) => item.files)
const everything = join(tmpdir(), "esuiss-all-items.mjs")

writeFileSync(
  everything,
  files
    .map(
      (file, index) =>
        `export * as m${index} from ${JSON.stringify(resolve(file))}`
    )
    .join("\n")
)

const only = process.env.SIZE?.split(",")

const checks = [
  ...registry.items.map((item) => check(item.name, item.files)),
  check("all", everything),
]

export default only
  ? checks.filter((entry) => only.includes(entry.name))
  : checks
