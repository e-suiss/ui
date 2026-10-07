import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { createProject } from "./helpers.mjs"

const entry = new URL("../../packages/cli/index.mjs", import.meta.url).pathname
const { version } = JSON.parse(
  readFileSync(new URL("../../packages/cli/package.json", import.meta.url))
)

function run(...args) {
  try {
    const stdout = execFileSync("node", [entry, ...args], {
      encoding: "utf8",
      stdio: "pipe",
      env: { ...process.env, NO_COLOR: "1" },
    })
    return { code: 0, stdout, stderr: "" }
  } catch (error) {
    return {
      code: error.status,
      stdout: String(error.stdout),
      stderr: String(error.stderr),
    }
  }
}

describe("esuiss-ui command", () => {
  it.each([[], ["--help"], ["-h"], ["help"]])(
    "prints the usage for %j",
    (...args) => {
      const result = run(...args)
      expect(result.code).toBe(0)
      expect(result.stdout).toContain("Usage:")
      expect(result.stdout).toContain("npx @esuiss/ui add <component...>")
    }
  )

  it("prints the package version", () => {
    expect(run("--version").stdout.trim()).toBe(version)
  })

  it("rejects an unknown command", () => {
    const result = run("remove")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Unknown command "remove"')
  })

  it("rejects an unknown option", () => {
    const result = run("add", "button", "--force")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("Unknown option --force")
  })

  it("requires a directory after --cwd", () => {
    const result = run("add", "button", "--cwd")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("--cwd needs a directory.")
  })

  it("reads the project from the directory given to --cwd", () => {
    const cwd = createProject({})
    const result = run("add", "--cwd", cwd, "button")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("No package.json found.")
  })
})
