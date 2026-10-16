import { readdir, rename, rm } from "node:fs/promises"
import path from "node:path"

const out = path.join(import.meta.dirname, "../out")
const locale = "en"
const folder = path.join(out, locale)

for (const entry of await readdir(folder)) {
  await rename(path.join(folder, entry), path.join(out, entry))
}
await rm(folder, { recursive: true })
await rename(path.join(out, `${locale}.html`), path.join(out, "index.html"))
await rename(path.join(out, `${locale}.txt`), path.join(out, "index.txt"))
