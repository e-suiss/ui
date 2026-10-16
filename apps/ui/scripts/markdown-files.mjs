import { mkdir, readdir, rename, rm } from "node:fs/promises"
import path from "node:path"

const out = path.join(import.meta.dirname, "../out")
const markdown = path.join(out, "llms.mdx")

for (const file of await readdir(path.join(markdown, "docs"), {
  recursive: true,
})) {
  if (!file.endsWith(".md")) continue
  const target = path.join(out, "docs", file)
  await mkdir(path.dirname(target), { recursive: true })
  await rename(path.join(markdown, "docs", file), target)
}
await rename(path.join(markdown, "docs.md"), path.join(out, "docs.md"))
await rm(markdown, { recursive: true })
