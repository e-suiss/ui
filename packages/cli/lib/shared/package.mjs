import { readFileSync } from "node:fs"

export const { name, version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8")
)
