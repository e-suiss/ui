import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const dir = ".vitest/perf"
if (!existsSync(dir)) {
  console.log("No performance results.")
  process.exit(0)
}

for (const file of readdirSync(dir).filter((name) => name.endsWith(".json"))) {
  console.log(`\n${file.replace(".json", "")}`)
  const data = JSON.parse(readFileSync(join(dir, file), "utf8"))
  for (const [name, values] of Object.entries(data)) {
    const fields = Object.entries(values)
      .map(([key, value]) => `${key} ${value}`)
      .join("  ")
    console.log(`  ${name.padEnd(28)} ${fields}`)
  }
}
