import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const dirs = [
  ".vitest/a11y",
  ".vitest/motion",
  ".vitest/text",
  ".vitest/responsive",
  ".vitest/rtl",
  ".vitest/long-text",
].filter(existsSync)
let total = 0

for (const dir of dirs) {
  for (const file of readdirSync(dir).filter((name) =>
    name.endsWith(".json")
  )) {
    const report = JSON.parse(readFileSync(join(dir, file), "utf8"))
    const items =
      report.found ??
      report.moved.map((line) => ({ check: "motion", rule: line, targets: [] }))
    for (const item of items) {
      total += 1
      const theme = item.theme ? ` (${item.theme})` : ""
      console.log(`${report.story} — ${item.check}: ${item.rule}${theme}`)
      for (const target of item.targets) console.log(`    ${target}`)
    }
  }
}

console.log(total === 0 ? "No findings." : `\n${total} findings.`)
