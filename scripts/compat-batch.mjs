import { spawn } from "node:child_process"
import { appendFileSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const FAILURE = /Compatibility check failed: ([\s\S]*?)(?:\n\S|$)/
const LAST_LINES = 40

const [script = "compat.mjs"] = process.argv.slice(2)
const runs = (process.env.RUNS ?? "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
if (!runs.length) {
  console.error("Set RUNS to the option lines to check, one per line.")
  process.exit(1)
}

const cache =
  process.env.COMPAT_CACHE ?? mkdtempSync(path.join(tmpdir(), "esuiss-cache-"))
const logs = process.env.COMPAT_LOGS ?? path.join(ROOT, "compat-logs")
mkdirSync(logs, { recursive: true })

function check(args, log) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join(ROOT, "scripts", script), ...args, `--cache=${cache}`],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }
    )
    let output = ""
    for (const stream of [child.stdout, child.stderr]) {
      stream.on("data", (chunk) => {
        output += chunk
        process.stdout.write(chunk)
      })
    }
    child.on("exit", (code) => {
      writeFileSync(log, output)
      resolve({ code, output })
    })
  })
}

const results = []
for (const [index, line] of runs.entries()) {
  const args = line.split(" ").filter(Boolean)
  console.log(`\n::group::${index + 1}/${runs.length} ${line}`)
  const started = Date.now()
  const { code, output } = await check(
    args,
    path.join(logs, `${String(index + 1).padStart(3, "0")}.log`)
  )
  console.log("::endgroup::")
  const seconds = Math.round((Date.now() - started) / 1000)
  const reason =
    code === 0
      ? ""
      : (output.match(FAILURE)?.[1] ??
        output.trim().split("\n").slice(-LAST_LINES).join("\n"))
  results.push({ line, ok: code === 0, seconds, reason })
  console.log(`${code === 0 ? "✓" : "✗"} ${line} (${seconds}s)`)
}

const failed = results.filter((result) => !result.ok)
const total = results.reduce((sum, result) => sum + result.seconds, 0)
const summary = [
  `### ${results.length - failed.length} of ${results.length} passed in ${Math.round(total / 60)} min`,
  "",
  ...(failed.length
    ? [
        "| Options | Failure |",
        "| --- | --- |",
        ...failed.map(
          (result) =>
            `| \`${result.line}\` | ${result.reason.replaceAll("|", "\\|").replaceAll("\n", "<br>")} |`
        ),
      ]
    : []),
  "",
].join("\n")

console.log(`\n${summary}`)
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
}
process.exitCode = failed.length ? 1 : 0
