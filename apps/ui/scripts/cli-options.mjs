import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const CLI = path.resolve(ROOT, "../../packages/cli/index.mjs")
const DOC = path.join(ROOT, "content/docs/cli.mdx")
const COMMANDS = ["init", "apply", "add"]
const HELP_OPTION = /^ {2}(-\w, )?--[\w-]+/
const DOC_OPTION = /^\| `(-[^`]+)` \|/
const OPTIONS_HEADER = "| Option | Description |"
const FLAG = /-{1,2}[a-z][\w-]*/g

function flagsOf(text) {
  return text.split(" <")[0].split("  ")[0].match(FLAG).join(" ")
}

function helpFlags(command) {
  const help = execFileSync("node", [CLI, command, "--help"], {
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  })
  const options = help.split("\nOptions:\n")[1] ?? ""
  return new Set(
    options
      .split("\n")
      .filter((line) => HELP_OPTION.test(line))
      .map((line) => flagsOf(line.trim()))
  )
}

function docFlags(source, command) {
  const section = source.split(`\n## ${command}\n`)[1]?.split("\n## ")[0]
  if (!section) return null
  const flags = new Set()
  let table = false
  for (const line of section.split("\n")) {
    if (line === OPTIONS_HEADER) table = true
    else if (!line.startsWith("|")) table = false
    const flag = table && line.match(DOC_OPTION)?.[1]
    if (flag) flags.add(flagsOf(flag))
  }
  return flags
}

const source = readFileSync(DOC, "utf8")
const problems = []

for (const command of COMMANDS) {
  const help = helpFlags(command)
  const docs = docFlags(source, command)
  if (!docs) {
    problems.push(`cli.mdx has no "## ${command}" section`)
    continue
  }
  for (const flag of help) {
    if (!docs.has(flag)) problems.push(`${command}: ${flag} is not documented`)
  }
  for (const flag of docs) {
    if (!help.has(flag)) {
      problems.push(`${command}: ${flag} is documented but not in --help`)
    }
  }
}

if (problems.length) {
  console.error(
    `content/docs/cli.mdx does not match the CLI:\n${problems.map((line) => `  ${line}`).join("\n")}`
  )
  process.exit(1)
}
