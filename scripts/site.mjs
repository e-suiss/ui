import { cp, rm } from "node:fs/promises"
import path from "node:path"

const root = path.join(import.meta.dirname, "..")
const dist = path.join(root, "dist")

await rm(dist, { recursive: true, force: true })
await cp(path.join(root, "apps/www/out"), dist, { recursive: true })
await cp(path.join(root, "apps/ui/out"), path.join(dist, "ui"), {
  recursive: true,
})
