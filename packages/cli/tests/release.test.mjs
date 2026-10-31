import { execFileSync } from "node:child_process"
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { createProject, read, temporaryDirectory } from "./helpers.mjs"

const scripts = new URL("../../../scripts/", import.meta.url).pathname
const registryScript = new URL(
  "../../web/scripts/build-registry.mjs",
  import.meta.url
).pathname
const webModules = new URL("../../web/node_modules", import.meta.url).pathname

const bin = temporaryDirectory("esuiss-bin-")
writeFileSync(path.join(bin, "gh"), '#!/bin/sh\necho "$FULL_RUNS"\n')
chmodSync(path.join(bin, "gh"), 0o755)

const env = {
  ...process.env,
  PATH: `${bin}${path.delimiter}${process.env.PATH}`,
  FULL_RUNS: "1",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_AUTHOR_NAME: "Release Test",
  GIT_AUTHOR_EMAIL: "release@example.com",
  GIT_COMMITTER_NAME: "Release Test",
  GIT_COMMITTER_EMAIL: "release@example.com",
}

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, env, encoding: "utf8" }).trim()
}

function manifest(version) {
  return { name: "package", version }
}

function repository({ cli = "0.9.0" } = {}) {
  const cwd = createProject({
    "packages/cli/package.json": manifest(cli),
    "packages/web/styles/globals.css": "",
    "packages/web/styles/theme.css": "",
    "packages/web/components/ui/button.tsx": "export {}",
    "apps/ui/content/docs/components/button.mdx":
      '---\ntitle: Button\ndescription: "A button."\n---\n',
  })
  mkdirSync(path.join(cwd, "scripts"))
  mkdirSync(path.join(cwd, "packages/web/scripts"))
  copyFileSync(
    path.join(scripts, "release.mjs"),
    path.join(cwd, "scripts/release.mjs")
  )
  copyFileSync(
    registryScript,
    path.join(cwd, "packages/web/scripts/build-registry.mjs")
  )
  symlinkSync(webModules, path.join(cwd, "packages/web/node_modules"))
  mkdirSync(path.join(cwd, "scripts/lib"))
  copyFileSync(
    path.join(scripts, "lib/registry.mjs"),
    path.join(cwd, "scripts/lib/registry.mjs")
  )
  execFileSync("node", ["scripts/build-registry.mjs"], {
    cwd: path.join(cwd, "packages/web"),
    env,
  })
  const origin = temporaryDirectory("esuiss-origin-")
  git(origin, "init", "--bare", "-b", "main")
  git(cwd, "init", "-b", "main")
  git(cwd, "add", ".")
  git(cwd, "commit", "-m", "initial")
  git(cwd, "remote", "add", "origin", origin)
  git(cwd, "push", "-u", "origin", "main")
  return { cwd, origin }
}

function release(cwd, ...args) {
  return releaseWith(env, cwd, ...args)
}

function releaseWith(environment, cwd, ...args) {
  try {
    const stdout = execFileSync("node", ["scripts/release.mjs", ...args], {
      cwd,
      env: environment,
      encoding: "utf8",
      stdio: "pipe",
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

const version = (cwd, file) => JSON.parse(read(cwd, file)).version

describe("release", () => {
  it.each([
    ["patch", "0.9.1"],
    ["minor", "0.10.0"],
    ["major", "1.0.0"],
    ["0.9.5", "0.9.5"],
  ])("bumps the CLI version for %s and pushes the tag", (input, expected) => {
    const { cwd, origin } = repository()
    const result = release(cwd, input)
    expect(result.stderr).toBe("")
    expect(result.code).toBe(0)
    expect(result.stdout).toContain(`Pushed v${expected}.`)
    expect(version(cwd, "packages/cli/package.json")).toBe(expected)
    expect(git(cwd, "log", "-1", "--format=%s")).toBe(
      `chore(release): v${expected}`
    )
    expect(git(cwd, "cat-file", "-t", `v${expected}`)).toBe("tag")
    expect(git(origin, "tag", "--list")).toBe(`v${expected}`)
    expect(git(origin, "rev-parse", "main")).toBe(git(cwd, "rev-parse", "HEAD"))
    expect(git(cwd, "status", "--porcelain")).toBe("")
  })

  it("tags the registry that the released CLI downloads", () => {
    const { cwd } = repository()
    expect(release(cwd, "patch").code).toBe(0)
    expect(
      JSON.parse(git(cwd, "show", "v0.9.1:packages/cli/package.json")).version
    ).toBe("0.9.1")
    expect(
      JSON.parse(git(cwd, "show", "v0.9.1:packages/web/registry/registry.json"))
        .items.length
    ).toBeGreaterThan(0)
  })

  it.each([[], ["next"], ["1.0"], ["v1.0.0"]])(
    "prints the usage for %j",
    (...args) => {
      const { cwd } = repository()
      const result = release(cwd, ...args)
      expect(result.code).toBe(1)
      expect(result.stderr).toContain(
        "Usage: pnpm release <patch|minor|major|x.y.z>"
      )
    }
  )

  it.each([
    ["0.9.0", "0.9.0 must be newer than 0.9.0."],
    ["0.8.9", "0.8.9 must be newer than 0.9.0."],
    ["0.10.0", null],
  ])("only accepts a newer exact version (%s)", (input, error) => {
    const { cwd } = repository()
    const result = release(cwd, input)
    if (error) {
      expect(result.code).toBe(1)
      expect(result.stderr).toContain(error)
    } else {
      expect(result.code).toBe(0)
    }
  })

  it("compares versions numerically, not as text", () => {
    const { cwd } = repository({ cli: "0.10.0" })
    const result = release(cwd, "0.9.9")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("0.9.9 must be newer than 0.10.0.")
  })

  it("refuses with uncommitted changes", () => {
    const { cwd } = repository()
    writeFileSync(path.join(cwd, "notes.md"), "draft")
    const result = release(cwd, "patch")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "Commit or stash your changes before releasing."
    )
    expect(version(cwd, "packages/cli/package.json")).toBe("0.9.0")
  })

  it("refuses outside the main branch", () => {
    const { cwd } = repository()
    git(cwd, "switch", "-c", "feature")
    const result = release(cwd, "patch")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("Releases are made from main.")
  })

  it("refuses when main has unpushed commits", () => {
    const { cwd } = repository()
    git(cwd, "commit", "--allow-empty", "-m", "local only")
    const result = release(cwd, "patch")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "main is not in sync with origin/main. Pull or push first."
    )
  })

  it("refuses until the full run passed on main", () => {
    const { cwd, origin } = repository()
    const result = releaseWith({ ...env, FULL_RUNS: "0" }, cwd, "patch")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("The Full run workflow has not passed on")
    expect(version(cwd, "packages/cli/package.json")).toBe("0.9.0")
    expect(git(origin, "tag", "--list")).toBe("")
  })

  it("refuses to reuse an existing tag", () => {
    const { cwd } = repository()
    git(cwd, "tag", "v0.9.1")
    const result = release(cwd, "patch")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("v0.9.1 already exists.")
  })

  it("refuses when the registry is out of date", () => {
    const { cwd } = repository()
    writeFileSync(
      path.join(cwd, "packages/web/components/ui/button.tsx"),
      'import { clsx } from "clsx"'
    )
    git(cwd, "commit", "-am", "change button")
    git(cwd, "push")
    const result = release(cwd, "patch")
    expect(result.code).not.toBe(0)
    expect(version(cwd, "packages/cli/package.json")).toBe("0.9.0")
    expect(git(cwd, "tag", "--list")).toBe("")
  })
})
