import { cpSync, existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const check = process.argv.includes("--check")
const APPS = ["site/apps/ui", "site/apps/uim"]
const FOLDERS = [
  "components/ui",
  "components/patterns",
  "components/interactions",
  "components/charts",
  "components/blocks",
  "hooks",
]

const stale = []
let copied = 0
for (const app of APPS) {
  for (const folder of FOLDERS) {
    const target = path.join(root, app, folder)
    if (!existsSync(target)) continue
    for (const file of readdirSync(target)) {
      const source = path.join(root, folder, file)
      const copy = path.join(target, file)
      if (!existsSync(source)) continue
      if (readFileSync(source, "utf8") === readFileSync(copy, "utf8")) continue
      if (check) stale.push(path.relative(root, copy))
      else {
        cpSync(source, copy)
        copied++
      }
    }
  }
}

if (check && stale.length) {
  console.error(
    `Site copies differ from the library. Run node scripts/sync-site.mjs:\n${stale.map((file) => `  ${file}`).join("\n")}`
  )
  process.exit(1)
}
console.log(check ? "Site copies are up to date." : `Synced ${copied} files.`)
