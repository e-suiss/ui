import { appendFile, cp, readdir, rm, stat } from "node:fs/promises"
import path from "node:path"
import { docsHubs } from "./lib/docs-hubs.mjs"

const root = path.join(import.meta.dirname, "..")
const dist = path.join(root, "dist")

await rm(dist, { recursive: true, force: true })
await cp(path.join(root, "apps/www/out"), dist, { recursive: true })
await cp(path.join(root, "apps/ui/out"), path.join(dist, "ui"), {
  recursive: true,
})

const hubRedirects = [...docsHubs()].map(
  ([url, { hub, anchor }]) => `/ui${url} /ui${hub}#${anchor} 301`
)
if (hubRedirects.length > 0)
  await appendFile(
    path.join(dist, "_redirects"),
    `${hubRedirects.join("\n")}\n`
  )

const LIMIT = 1.75 * 1024 * 1024
const heavy = []
for (const file of await readdir(dist, { recursive: true })) {
  if (!file.endsWith(".html")) continue
  const { size } = await stat(path.join(dist, file))
  if (size > LIMIT) heavy.push(`${file} ${(size / 1024 / 1024).toFixed(2)} MB`)
}
if (heavy.length > 0) {
  console.error(
    `Pages over ${LIMIT / 1024 / 1024} MB, Googlebot reads only the first 2 MB:\n${heavy.join("\n")}`
  )
  process.exit(1)
}
