import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const DOCS = path.resolve(import.meta.dirname, "../content/docs")
const COUNT = /^description: (\d+) /m
const PLATFORM_COUNTS = /(\d+) for React and (\d+) for React Native/
const PLATFORMS = /^platforms: \[([^\]]*)\]/m

const problems = []

for (const entry of readdirSync(DOCS, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const folder = path.join(DOCS, entry.name)
  const files = readdirSync(folder).filter(
    (file) => file.endsWith(".mdx") && file !== "index.mdx"
  )
  const pages = files.length
  const index = readFileSync(path.join(folder, "index.mdx"), "utf8")
  const stated = index.match(COUNT)?.[1]
  if (stated && Number(stated) !== pages) {
    problems.push(
      `${entry.name}/index.mdx says ${stated}, the folder has ${pages}`
    )
  }
  const split = index.match(PLATFORM_COUNTS)
  if (split) {
    const platforms = files.map(
      (file) =>
        readFileSync(path.join(folder, file), "utf8")
          .match(PLATFORMS)?.[1]
          .split(",")
          .map((item) => item.trim()) ?? []
    )
    const web = platforms.filter((list) => list.includes("web")).length
    const rn = platforms.filter((list) => list.includes("rn")).length
    if (Number(split[1]) !== web || Number(split[2]) !== rn) {
      problems.push(
        `${entry.name}/index.mdx says ${split[1]} for React and ${split[2]} for React Native, the pages have ${web} and ${rn}`
      )
    }
  }
}

if (problems.length) {
  console.error(
    `Collection counts are out of date:\n${problems.map((line) => `  ${line}`).join("\n")}`
  )
  process.exit(1)
}
