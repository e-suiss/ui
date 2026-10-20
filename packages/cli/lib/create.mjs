import { existsSync, readdirSync } from "node:fs"
import path from "node:path"

import { CliError, step } from "./output.mjs"
import { agentPackageManager, runCommand } from "./shared/project.mjs"

export const TEMPLATES = {
  next: { title: "Next.js", platform: "web" },
  vite: { title: "Vite", platform: "web" },
  expo: { title: "Expo", platform: "rn" },
  "react-native": { title: "React Native", platform: "rn" },
}

const UNSUPPORTED_TEMPLATES = {
  start: "TanStack Start",
  "react-router": "React Router",
  astro: "Astro",
  laravel: "Laravel",
}

const RUNNERS = {
  npm: ["npx", []],
  pnpm: ["pnpm", ["dlx"]],
  yarn: ["yarn", ["dlx"]],
  bun: ["bunx", []],
}

export const PACKAGE_MANAGERS = Object.keys(RUNNERS)

const REACT_NATIVE_MANAGERS = ["npm", "yarn", "bun"]

const PROJECT_NAME = /^[a-z0-9][a-z0-9._-]*$/
const NAME_PARTS = /[^a-z0-9]+/
const LEADING_DIGIT = /^[0-9]/
const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/

export function appNameOf(name) {
  const pascal = name
    .split(NAME_PARTS)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("")
  return LEADING_DIGIT.test(pascal) ? `App${pascal}` : pascal
}

function creatorArgs(template, name, packageManager) {
  if (template === "next") {
    return [
      "create-next-app@latest",
      name,
      "--ts",
      "--tailwind",
      "--eslint",
      "--app",
      "--src-dir",
      "--import-alias",
      "@/*",
      `--use-${packageManager}`,
      "--yes",
      "--disable-git",
    ]
  }
  if (template === "vite") {
    return [
      "create-vite@latest",
      name,
      "--template",
      "react-ts",
      "--no-interactive",
    ]
  }
  if (template === "react-native") {
    return [
      "@react-native-community/cli@latest",
      "init",
      appNameOf(name),
      "--directory",
      name,
      "--skip-git-init",
      "--install-pods",
      "false",
      ...(REACT_NATIVE_MANAGERS.includes(packageManager)
        ? ["--pm", packageManager]
        : ["--skip-install"]),
    ]
  }
  return [
    "create-expo-app@latest",
    name,
    "--template",
    "blank-typescript",
    "--yes",
  ]
}

function defaultRun(command, args, cwd) {
  return runCommand(command, args, cwd).status === 0
}

function packageManagerOf() {
  return agentPackageManager() ?? "npm"
}

export function templateProblem(template) {
  if (TEMPLATES[template]) return null
  const title = UNSUPPORTED_TEMPLATES[template]
  const supported = Object.keys(TEMPLATES).join(", ")
  if (title) {
    return `The ${title} template is not available yet. Pick ${supported}, or create the app yourself and run init in it.`
  }
  return `--template needs ${supported}.`
}

export function createProject(
  { template, name, cwd, packageManager = packageManagerOf() },
  run = defaultRun
) {
  const projectName = name ?? `${template}-app`
  if (!PROJECT_NAME.test(projectName)) {
    throw new CliError(
      `${projectName} is not a valid project name. Use lowercase letters, numbers, dots, dashes or underscores.`
    )
  }
  if (WINDOWS_RESERVED.test(projectName) || projectName.endsWith(".")) {
    throw new CliError(
      `${projectName} is a reserved name on Windows. Pick another folder name.`
    )
  }
  const target = path.join(cwd, projectName)
  if (existsSync(target) && readdirSync(target).length) {
    throw new CliError(`${projectName} already exists and is not empty.`)
  }
  const [command, prefix] = RUNNERS[packageManager] ?? RUNNERS.npm
  const args = [
    ...prefix,
    ...creatorArgs(template, projectName, packageManager),
  ]
  step(`Creating a ${TEMPLATES[template].title} app in ${projectName}`)
  if (!run(command, args, cwd)) {
    throw new CliError(`${command} ${args.join(" ")} failed.`)
  }
  const installs =
    template === "vite" ||
    (template === "react-native" &&
      !REACT_NATIVE_MANAGERS.includes(packageManager))
  if (installs && !run(packageManager, ["install"], target)) {
    throw new CliError(`${packageManager} install failed in ${projectName}.`)
  }
  return target
}
