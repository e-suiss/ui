import { execFile } from "node:child_process"
import { readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { promisify } from "node:util"

const run = promisify(execFile)
const root = path.join(import.meta.dirname, "..")
const docs = path.join(root, "content/docs")
const output = path.join(root, "content-dates.json")
const CONCURRENCY = 16

async function commits(file) {
  try {
    const { stdout } = await run(
      "git",
      [
        "log",
        "--follow",
        "--format=%cI",
        "--",
        path.join("content/docs", file),
      ],
      { cwd: root }
    )
    return stdout.split("\n").filter(Boolean)
  } catch {
    return []
  }
}

const files = readdirSync(docs, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.split(path.sep).join("/"))
  .sort()

const dates = {}
for (let index = 0; index < files.length; index += CONCURRENCY) {
  const batch = files.slice(index, index + CONCURRENCY)
  const found = await Promise.all(batch.map(commits))
  batch.forEach((file, position) => {
    const list = found[position]
    if (list.length > 0)
      dates[file] = { published: list.at(-1), modified: list[0] }
  })
}

writeFileSync(output, `${JSON.stringify(dates, null, 2)}\n`)
console.log(
  `content-dates: ${Object.keys(dates).length} of ${files.length} pages dated`
)
