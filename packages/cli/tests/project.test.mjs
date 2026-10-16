import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { install as installMobile } from "../lib/mobile/project.mjs"
import { CliError } from "../lib/output.mjs"
import {
  detectBase,
  detectProject,
  findAliasRoot,
  install,
} from "../lib/project.mjs"
import { ensureAlias } from "../lib/shared/project.mjs"
import { createProject } from "./helpers.mjs"

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const tsconfig = { compilerOptions: {} }

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("detectBase", () => {
  it.each([
    ["radix-nova", "radix"],
    ["radix-vega", "radix"],
    ["new-york", "radix"],
    ["default", "radix"],
    ["base-nova", "base"],
    ["aria-nova", "aria"],
    ["aria-vega", "aria"],
  ])("maps the %s style to the %s base", (style, base) => {
    expect(detectBase(createProject({ "components.json": { style } }))).toBe(
      base
    )
  })

  it("uses the default base without components.json", () => {
    expect(detectBase(createProject({}))).toBe("base")
  })

  it("uses the default base when components.json is unreadable", () => {
    expect(detectBase(createProject({ "components.json": "{" }))).toBe("base")
  })
})

describe("detectProject", () => {
  it("recognises a Next.js project", () => {
    const cwd = createProject({
      "package.json": { dependencies: { next: "16.0.0", react: "19.0.0" } },
      "tsconfig.json": tsconfig,
    })
    expect(detectProject(cwd)).toMatchObject({ cwd, framework: "next" })
  })

  it("recognises a React project built with Vite", () => {
    const cwd = createProject({
      "package.json": {
        dependencies: { react: "19.0.0" },
        devDependencies: { vite: "7.0.0" },
      },
      "tsconfig.json": tsconfig,
    })
    expect(detectProject(cwd).framework).toBe("vite")
  })

  it("rejects a folder without package.json", () => {
    const cwd = createProject({})
    expect(() => detectProject(cwd)).toThrow(CliError)
  })

  it("rejects projects that are neither Next.js nor React with Vite", () => {
    const cwd = createProject({
      "package.json": { devDependencies: { vite: "7.0.0" } },
      "tsconfig.json": tsconfig,
    })
    expect(() => detectProject(cwd)).toThrow(
      "Only Next.js and React (Vite) projects are supported."
    )
  })

  it("requires TypeScript", () => {
    const cwd = createProject({
      "package.json": { dependencies: { next: "16.0.0" } },
    })
    expect(() => detectProject(cwd)).toThrow("tsconfig.json not found")
  })

  it.each([
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["package-lock.json", "npm"],
  ])("detects the package manager from %s", (lockfile, manager) => {
    const cwd = createProject({
      "package.json": { dependencies: { next: "16.0.0" } },
      "tsconfig.json": tsconfig,
      [lockfile]: "",
    })
    expect(detectProject(cwd).packageManager).toBe(manager)
  })

  it("prefers the packageManager field over the lockfile", () => {
    const cwd = createProject({
      "package.json": {
        packageManager: "yarn@4.5.0",
        dependencies: { next: "16.0.0" },
      },
      "tsconfig.json": tsconfig,
      "package-lock.json": "",
    })
    expect(detectProject(cwd).packageManager).toBe("yarn")
  })

  it("reads the packageManager field of the workspace root", () => {
    const root = createProject({
      "package.json": { packageManager: "pnpm@11.0.0", workspaces: ["apps/*"] },
      "apps/web/package.json": { dependencies: { next: "16.0.0" } },
      "apps/web/tsconfig.json": tsconfig,
    })
    expect(detectProject(path.join(root, "apps/web")).packageManager).toBe(
      "pnpm"
    )
  })

  it("follows the package manager that runs the CLI", () => {
    vi.stubEnv("npm_config_user_agent", "bun/1.3.0 npm/? node/v22.0.0")
    const cwd = createProject({
      "package.json": { dependencies: { next: "16.0.0" } },
      "tsconfig.json": tsconfig,
    })
    expect(detectProject(cwd).packageManager).toBe("bun")
  })

  it("prefers the lockfile when the CLI runs with npx", () => {
    vi.stubEnv("npm_config_user_agent", "npm/11.0.0 node/v22.0.0")
    const cwd = createProject({
      "package.json": { dependencies: { next: "16.0.0" } },
      "tsconfig.json": tsconfig,
      "pnpm-lock.yaml": "",
    })
    expect(detectProject(cwd).packageManager).toBe("pnpm")
  })

  it.each([
    ["pnpm-workspace.yaml", ""],
    ["package.json", { workspaces: ["apps/*"] }],
    [".git/HEAD", ""],
  ])("stops looking for lockfiles at a folder with %s", (file, content) => {
    const outer = createProject({
      "yarn.lock": "",
      [`repo/${file}`]: content,
      "repo/apps/web/package.json": { dependencies: { next: "16.0.0" } },
      "repo/apps/web/tsconfig.json": tsconfig,
    })
    const project = detectProject(path.join(outer, "repo/apps/web"))
    expect(project.packageManager).toBe("npm")
  })

  it("names a package.json that is not valid JSON", () => {
    const cwd = createProject({
      "package.json": "{ broken",
      "tsconfig.json": tsconfig,
    })
    expect(() => detectProject(cwd)).toThrow(
      `Could not read package.json in ${cwd}:`
    )
  })

  it("finds the lockfile of a parent workspace", () => {
    const root = createProject({
      "pnpm-lock.yaml": "",
      "apps/web/package.json": { dependencies: { next: "16.0.0" } },
      "apps/web/tsconfig.json": tsconfig,
    })
    const project = detectProject(path.join(root, "apps/web"))
    expect(project.packageManager).toBe("pnpm")
  })
})

describe("findAliasRoot", () => {
  it("resolves the @/* alias against baseUrl", () => {
    const cwd = createProject({
      "tsconfig.json": {
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
      },
    })
    expect(findAliasRoot(cwd)).toBe(path.join(cwd, "src"))
  })

  it("reads tsconfig files with comments and trailing commas", () => {
    const cwd = createProject({
      "tsconfig.json": `{
  // generated by create-next-app
  "compilerOptions": {
    /* aliases */
    "paths": { "@/*": ["./*"], },
  },
}`,
    })
    expect(findAliasRoot(cwd)).toBe(cwd)
  })

  it("falls back to tsconfig.app.json", () => {
    const cwd = createProject({
      "tsconfig.json": { files: [] },
      "tsconfig.app.json": {
        compilerOptions: { paths: { "@/*": ["./src/*"] } },
      },
    })
    expect(findAliasRoot(cwd)).toBe(path.join(cwd, "src"))
  })

  it("follows extends to a shared base config", () => {
    const root = createProject({
      "tsconfig.base.json": {
        compilerOptions: { paths: { "@/*": ["./apps/web/src/*"] } },
      },
      "apps/web/tsconfig.json": `{
  // extends the workspace config
  "extends": "../../tsconfig.base",
}`,
    })
    expect(findAliasRoot(path.join(root, "apps/web"))).toBe(
      path.join(root, "apps/web/src")
    )
  })

  it("lets a local config override the inherited alias and baseUrl", () => {
    const root = createProject({
      "tsconfig.base.json": {
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./shared/*"] } },
      },
      "apps/web/tsconfig.json": {
        extends: ["../../tsconfig.base.json"],
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
      },
    })
    expect(findAliasRoot(path.join(root, "apps/web"))).toBe(
      path.join(root, "apps/web/src")
    )
  })

  it("does not add the alias again when a base config has it", () => {
    const root = createProject({
      "tsconfig.base.json": {
        compilerOptions: { paths: { "@/*": ["./apps/web/*"] } },
      },
      "apps/web/tsconfig.json": { extends: "../../tsconfig.base.json" },
    })
    const cwd = path.join(root, "apps/web")
    expect(ensureAlias({ cwd }, cwd)).toBe(false)
    expect(readFileSync(path.join(cwd, "tsconfig.json"), "utf8")).not.toContain(
      "paths"
    )
  })

  it("names a tsconfig that is not valid JSON", () => {
    const cwd = createProject({ "tsconfig.json": "{ broken" })
    expect(() => findAliasRoot(cwd)).toThrow(
      `Could not read tsconfig.json in ${cwd}:`
    )
  })

  it("returns null when no alias is configured", () => {
    const cwd = createProject({ "tsconfig.json": tsconfig })
    expect(findAliasRoot(cwd)).toBeNull()
  })
})

describe("install", () => {
  const project = (packageManager) => ({
    cwd: "/project",
    packageManager,
    packages: { react: "19.0.0" },
  })

  beforeEach(() => {
    vi.mocked(spawnSync).mockClear()
    vi.mocked(spawnSync).mockReturnValue({ status: 0 })
  })

  it("installs only packages that are missing, once each", () => {
    const target = project("pnpm")
    const installed = install(target, ["react", "cmdk", "cmdk", "recharts"])
    expect(installed).toEqual(["cmdk", "recharts"])
    expect(spawnSync).toHaveBeenCalledWith(
      "pnpm",
      ["add", "cmdk", "recharts"],
      expect.objectContaining({ cwd: "/project" })
    )
    expect(target.packages.cmdk).toBe("*")
  })

  it("skips the package manager when everything is installed", () => {
    expect(install(project("npm"), ["react"])).toEqual([])
    expect(spawnSync).not.toHaveBeenCalled()
  })

  it.each([
    ["npm", ["install", "--save-dev", "tailwindcss"]],
    ["pnpm", ["add", "--save-dev", "tailwindcss"]],
    ["yarn", ["add", "--dev", "tailwindcss"]],
    ["bun", ["add", "--dev", "tailwindcss"]],
  ])("uses the dev flag of %s", (manager, args) => {
    install(project(manager), ["tailwindcss"], { dev: true })
    expect(spawnSync).toHaveBeenCalledWith(manager, args, expect.anything())
  })

  it("fails when the package manager fails", () => {
    vi.mocked(spawnSync).mockReturnValue({ status: 1 })
    expect(() => install(project("npm"), ["cmdk"])).toThrow(
      "npm install cmdk failed."
    )
  })

  it.each(["cmdk & calc", "--registry=http://evil", "../local"])(
    "refuses the invalid package name %s",
    (name) => {
      expect(() => install(project("npm"), [name])).toThrow(
        `Refusing to install an invalid package name: ${name}`
      )
      expect(spawnSync).not.toHaveBeenCalled()
    }
  )
})

describe("mobile install", () => {
  const project = (framework) => ({
    cwd: "/project",
    framework,
    packageManager: "npm",
    packages: {},
  })

  beforeEach(() => {
    vi.mocked(spawnSync).mockClear()
    vi.mocked(spawnSync).mockReturnValue({ status: 0 })
  })

  it("accepts version specs and reports the bare package names", () => {
    const installed = installMobile(project("react-native"), [
      "nativewind@^4.2.7",
      "@scope/name@1.0.0",
    ])
    expect(installed).toEqual(["nativewind", "@scope/name"])
    expect(spawnSync).toHaveBeenCalledWith(
      "npm",
      ["install", "nativewind@^4.2.7", "@scope/name@1.0.0"],
      expect.anything()
    )
  })

  it.each([
    ["expo", "cmdk & calc", "cmdk & calc"],
    ["react-native", "--registry=http://evil", "--registry=http://evil"],
    ["react-native", "../local@1.0.0", "../local"],
  ])(
    "refuses an invalid package name in a %s project",
    (framework, spec, name) => {
      expect(() => installMobile(project(framework), [spec])).toThrow(
        `Refusing to install an invalid package name: ${name}`
      )
      expect(spawnSync).not.toHaveBeenCalled()
    }
  )
})
