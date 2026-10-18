import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const DOCS = path.resolve(import.meta.dirname, "../content/docs")
const COUNT = /^description: (\d+) /m

const problems = []

for (const entry of readdirSync(DOCS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const folder = path.join(DOCS, entry.name)
  const pages = readdirSync(folder).filter(
    (file) => file.endsWith(".mdx") && file !== "index.mdx"
  ).length
  const index = readFileSync(path.join(folder, "index.mdx"), "utf8")
  const stated = index.match(COUNT)?.[1]
  if (stated && Number(stated) !== pages) {
    problems.push(
      `${entry.name}/index.mdx says ${stated}, the folder has ${pages}`
    )
  }
}

if (problems.length) {
  console.error(
    `Collection counts are out of date:\n${problems.map((line) => `  ${line}`).join("\n")}`
  )
  process.exit(1)
}
