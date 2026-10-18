import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createProject, templateProblem } from "../lib/create.mjs"
import { silenceOutput, temporaryDirectory } from "./helpers.mjs"

beforeEach(() => {
  silenceOutput()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("templateProblem", () => {
  it.each(["next", "vite", "expo"])("accepts %s", (template) => {
    expect(templateProblem(template)).toBeNull()
  })

  it.each([
    ["start", "TanStack Start"],
    ["react-router", "React Router"],
    ["astro", "Astro"],
    ["laravel", "Laravel"],
  ])("explains that %s is not available yet", (template, title) => {
    expect(templateProblem(template)).toContain(
      `The ${title} template is not available yet.`
    )
  })

  it("lists the templates for an unknown one", () => {
    expect(templateProblem("remix")).toBe("--template needs next, vite, expo.")
    expect(templateProblem(undefined)).toBe(
      "--template needs next, vite, expo."
    )
  })
})

describe("createProject", () => {
  it("runs create-next-app with the package manager", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    const run = vi.fn(() => true)
    const target = createProject(
      { template: "next", cwd, packageManager: "pnpm" },
      run
    )
    expect(target).toBe(path.join(cwd, "next-app"))
    expect(run).toHaveBeenCalledTimes(1)
    const [command, args, where] = run.mock.calls[0]
    expect(command).toBe("pnpm")
    expect(args.slice(0, 3)).toEqual([
      "dlx",
      "create-next-app@latest",
      "next-app",
    ])
    expect(args).toContain("--use-pnpm")
    expect(args).toContain("--tailwind")
    expect(where).toBe(cwd)
  })

  it("creates a Vite app and installs its packages", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    const run = vi.fn(() => true)
    createProject(
      { template: "vite", name: "web", cwd, packageManager: "bun" },
      run
    )
    expect(run.mock.calls[0][0]).toBe("bunx")
    expect(run.mock.calls[0][1]).toEqual([
      "create-vite@latest",
      "web",
      "--template",
      "react-ts",
      "--no-interactive",
    ])
    expect(run.mock.calls[1]).toEqual([
      "bun",
      ["install"],
      path.join(cwd, "web"),
    ])
  })

  it("creates an Expo app with npx by default", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    const run = vi.fn(() => true)
    createProject({ template: "expo", cwd, packageManager: "npm" }, run)
    expect(run.mock.calls[0][0]).toBe("npx")
    expect(run.mock.calls[0][1][0]).toBe("create-expo-app@latest")
  })

  it("uses yarn dlx for yarn", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    const run = vi.fn(() => true)
    createProject({ template: "expo", cwd, packageManager: "yarn" }, run)
    expect(run.mock.calls[0].slice(0, 2)).toEqual([
      "yarn",
      [
        "dlx",
        "create-expo-app@latest",
        "expo-app",
        "--template",
        "blank-typescript",
        "--yes",
      ],
    ])
  })

  it("refuses a folder that is not empty", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    mkdirSync(path.join(cwd, "next-app"))
    writeFileSync(path.join(cwd, "next-app", "file.txt"), "")
    expect(() =>
      createProject(
        { template: "next", cwd },
        vi.fn(() => true)
      )
    ).toThrow("next-app already exists and is not empty.")
  })

  it("refuses an invalid name", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    expect(() =>
      createProject({ template: "next", name: "My App", cwd }, vi.fn())
    ).toThrow("My App is not a valid project name.")
  })

  it("fails when the creator fails", () => {
    const cwd = temporaryDirectory("esuiss-create-")
    expect(() =>
      createProject(
        { template: "next", cwd, packageManager: "npm" },
        vi.fn(() => false)
      )
    ).toThrow("failed.")
  })
})
