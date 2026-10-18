import { readdir, rm } from "node:fs/promises"
import path from "node:path"
import { nativeWebPreviews } from "../lib/native-web.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const PREVIEWS = path.join(ROOT, "public/previews")
const CAPTURE = /^(.+?)\.(?:light|dark)\.(?:webp|mp4)$/

const { nativeOnly } = nativeWebPreviews(path.join(ROOT, "content"))
const wanted = new Set(nativeOnly)
const captures = (await readdir(PREVIEWS)).filter((file) => CAPTURE.test(file))
const captured = new Set(captures.map((file) => file.match(CAPTURE)?.[1]))
const stale = captures.filter((file) => !wanted.has(file.match(CAPTURE)?.[1]))
const missing = nativeOnly.filter((id) => !captured.has(id))

if (process.argv.includes("--prune")) {
  await Promise.all(stale.map((file) => rm(path.join(PREVIEWS, file))))
  console.log(`Removed ${stale.length} captures shown as web previews`)
} else if (process.argv.includes("--check")) {
  if (stale.length) {
    console.error(
      `${stale.length} captures are shown as web previews, run pnpm previews --prune:\n${stale.join("\n")}`
    )
    process.exit(1)
  }
} else {
  console.log(`${nativeOnly.length} native-only examples need captures:`)
  console.log(nativeOnly.join("\n"))
  if (missing.length) console.log(`\nMissing captures:\n${missing.join("\n")}`)
  if (stale.length) console.log(`\n${stale.length} stale captures`)
}
