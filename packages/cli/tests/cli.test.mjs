import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
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

  it.each([
    ["init", "--primary"],
    ["init", "--primary", "--yes"],
  ])("asks for a value after a bare --primary in %j", (...args) => {
    const result = run(...args)
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain("--primary needs a color")
    expect(result.stderr).not.toContain("undefined")
  })

  it("rejects a preset with the gray base color", () => {
    const result = run("init", "--platform", "web", "--preset", "bw5OFzsG")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain("The gray base color is not available")
  })

  it("keeps --primary to init", () => {
    const result = run("add", "button", "--primary", "#2563eb")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain("work with init or apply")
  })

  it("keeps --style to init and apply", () => {
    const result = run("add", "button", "--style", "vega")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("work with init or apply")
    expect(run("add", "--help").stdout).not.toContain("--style <name>")
    expect(run("init", "--help").stdout).toContain("--style <name>")
    expect(run("apply", "--help").stdout).toContain("--style <name>")
  })

  it("lists the apply command in the usage", () => {
    expect(run("--help").stdout).toContain("apply --preset <code>")
    const help = run("apply", "--help").stdout
    expect(help).toContain("--only <theme|font>")
    expect(help).toContain("--pointer")
  })

  it("lists --template in the init help", () => {
    const help = run("init", "--help").stdout
    expect(help).toContain("--template <next|vite|expo>")
    expect(help).toContain("--rtl")
  })

  it.each([
    ["astro", "The Astro template is not available yet."],
    ["start", "The TanStack Start template is not available yet."],
    ["react-router", "The React Router template is not available yet."],
    ["laravel", "The Laravel template is not available yet."],
    ["remix", "--template needs next, vite, expo."],
  ])("rejects --template %s", (template, message) => {
    const result = run("init", "--template", template)
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain(message)
  })

  it("explains that --monorepo is not available yet", () => {
    const result = run("init", "--template", "next", "--monorepo")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain("--monorepo is not available yet")
  })

  it("rejects an unknown --only", () => {
    const result = run("apply", "--only", "colors")
    expect(result.stderr).toContain("--only needs theme or font.")
  })

  it("keeps --only to apply", () => {
    const result = run("init", "--only", "theme")
    expect(result.stderr).toContain("--only works with apply.")
  })

  it("keeps --name to --template", () => {
    const result = run("init", "--name", "web")
    expect(result.stderr).toContain("--name works with --template.")
  })

  it("needs something to apply", () => {
    const result = run("apply")
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain(
      "apply needs --preset, --primary, --style or --pointer."
    )
  })

  it("keeps --style out of --only font", () => {
    const result = run("apply", "--only", "font", "--style", "vega")
    expect(result.stderr).toContain("drop --only font to use it")
  })

  it("takes --style with --only theme", () => {
    const result = run(
      "apply",
      "--only",
      "theme",
      "--style",
      "vega",
      "--cwd",
      "missing-folder-for-the-test"
    )
    expect(result.stderr).not.toContain("drop --only")
  })

  it("keeps --primary and --theme out of --only font", () => {
    for (const flag of [
      ["--primary", "#ff0000"],
      ["--theme", "suiss"],
    ]) {
      const result = run(
        "apply",
        "--only",
        "font",
        "--preset",
        "bJ4oV1t",
        ...flag
      )
      expect(result.code).not.toBe(0)
      expect(result.stderr).toContain(
        "--primary and --theme change the colors; drop --only font to use them."
      )
    }
  })

  it.each([
    [
      ["--template", "next", "--icon-library", "lucide"],
      "--icon-library works with",
    ],
    [
      ["--template", "next", "--styling", "uniwind"],
      "--styling works with React Native",
    ],
    [["--template", "vite", "--path", "x"], "--path works with"],
    [
      ["--template", "expo", "--base", "radix"],
      "--base works with React projects.",
    ],
    [
      ["--template", "expo", "--rtl"],
      "--rtl and --pointer work with React projects.",
    ],
  ])("checks %j before creating the app", (args, message) => {
    const cwd = createProject({})
    const result = run("init", ...args, "--cwd", cwd)
    expect(result.code).not.toBe(0)
    expect(result.stderr).toContain(message)
    expect(readdirSync(cwd)).toEqual([])
  })

  it("lists the options of every command in the top-level usage", () => {
    const { stdout } = run("--help")
    for (const option of [
      "--preset",
      "--style",
      "--only",
      "--template",
      "--overwrite",
    ]) {
      expect(stdout).toContain(option)
    }
    expect(stdout).toContain("<command> --help")
  })

  it("rejects --template with another platform", () => {
    const result = run("init", "--template", "expo", "--platform", "web")
    expect(result.stderr).toContain(
      "--template expo creates a React Native app."
    )
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
