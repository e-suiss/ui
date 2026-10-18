import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { createProject } from "./helpers.mjs"

const entry = new URL("../index.mjs", import.meta.url).pathname
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url))
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
  it("rejects a --primary that is not a color", () => {
    const result = run("init", "--primary", "blue")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain('"blue" is not a color')
  })

  it("keeps --primary to init", () => {
    const result = run("add", "button", "--primary", "#2563eb")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain("--primary work with init")
  })

  it("lists --primary in the init help", () => {
    expect(run("init", "--help").stdout).toContain("--primary <color>")
  })

  it.each([[], ["--help"], ["-h"], ["help"]])(
    "prints the usage for %j",
    (...args) => {
      const result = run(...args)
      expect(result.code).toBe(0)
      expect(result.stdout).toContain("Usage:")
      expect(result.stdout).toContain("npx @esuiss/ui add <component...>")
    }
  )

  it.each([["--help"], ["-h"]])("prints the add usage for add %s", (flag) => {
    const result = run("add", "button", flag)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("npx @esuiss/ui add patterns <pattern...>")
    expect(result.stdout).toContain("--diff")
    expect(result.stdout).not.toContain("init [options]")
  })

  it("prints the init usage for init --help", () => {
    const result = run("init", "--help")
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("npx @esuiss/ui init [options]")
    expect(result.stdout).not.toContain("--diff")
  })

  it.each([
    ["add", "-v"],
    ["init", "--version"],
  ])("prints the version for %s %s", (command, flag) => {
    expect(run(command, flag).stdout.trim()).toBe(version)
  })

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

  it("requires a known primitive base after --base", () => {
    const result = run("add", "button", "--base", "other")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("--base needs base, radix or aria.")
  })

  it("only takes --base for React projects", () => {
    const cwd = createProject({
      "package.json": { dependencies: { expo: "54.0.0" } },
    })
    const result = run("add", "button", "--base", "radix", "--cwd", cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("--base works with React projects.")
  })

  it("reads the project from the directory given to --cwd", () => {
    const cwd = createProject({})
    const result = run("add", "--cwd", cwd, "button")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      `No React, React Native, Xcode or Android Gradle project found in ${cwd}.`
    )
  })
})
