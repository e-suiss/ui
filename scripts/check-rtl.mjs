import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const DIRECTIONAL_ICON =
  /<((?:Caret|Arrow)(?:Left|Right|LineLeft|LineRight|BendUpLeft|BendUpRight|UUpLeft|UUpRight)\w*Icon)\b[\s\S]*?\/>/g
const PHYSICAL_CLASS =
  /(?<![\w-])(?:-?(?:ml|mr|pl|pr)-[\w./[\]()-]+|text-(?:left|right)|rounded-(?:l|r|tl|tr|bl|br)(?:-\w+)?|border-(?:l|r)(?:-\d+)?|float-(?:left|right))(?![\w-])/g

const SIDE_VARIANT = /=(?:left|right)\]/

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return files(path)
    return path.endsWith(".tsx") ? [path] : []
  })
}

const problems = []
for (const file of files("components")) {
  const text = readFileSync(file, "utf8")
  const line = (index) => text.slice(0, index).split("\n").length
  for (const match of text.matchAll(DIRECTIONAL_ICON)) {
    if (!match[0].includes("rtl:")) {
      problems.push(
        `${file}:${line(match.index)} ${match[1]} does not flip in RTL`
      )
    }
  }
  for (const match of text.matchAll(PHYSICAL_CLASS)) {
    const token = text
      .slice(0, match.index)
      .split(/[\s"'`]/)
      .at(-1)
    if (token && SIDE_VARIANT.test(token)) continue
    problems.push(
      `${file}:${line(match.index)} ${match[0]} is a physical direction class`
    )
  }
}

for (const problem of problems) console.log(problem)
console.log(
  problems.length === 0
    ? "Every directional icon flips and no physical direction class is used."
    : `\n${problems.length} RTL problems.`
)
process.exitCode = problems.length === 0 ? 0 : 1
