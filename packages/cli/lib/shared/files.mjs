import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"

import { formatDiff } from "../diff.mjs"
import {
  CliError,
  color,
  list,
  note,
  printable,
  revealed,
  step,
} from "../output.mjs"

const CONCURRENCY = 8
const SEPARATORS = /[\\/]/
const SEGMENT = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/
const EXECUTABLE_NAME = /^package\.swift$|\.config\.[a-z]+$/i
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css"]
const SOURCE_DIRECTORIES = ["components", "hooks", "lib"]
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com\d|lpt\d)(?:\.|$)/i
const MAX_SEGMENT = 100
const MAX_PATH = 200
const BUILD_DIRECTORIES = [
  "build",
  "buildsrc",
  "carthage",
  "deriveddata",
  "gradle",
  "node_modules",
  "pods",
]

const TARGETS = {
  web: {
    directories: SOURCE_DIRECTORIES,
    extensions: SOURCE_EXTENSIONS,
  },
  rn: {
    directories: SOURCE_DIRECTORIES,
    extensions: SOURCE_EXTENSIONS,
  },
  swift: { extensions: [".swift"], excluded: BUILD_DIRECTORIES },
  kotlin: { extensions: [".kt"], excluded: BUILD_DIRECTORIES },
  font: { extensions: [".ttf"], excluded: BUILD_DIRECTORIES },
}

export function isRegistryPath(file) {
  return (
    typeof file === "string" &&
    file.length <= MAX_PATH &&
    file
      .split("/")
      .every(
        (segment) =>
          SEGMENT.test(segment) &&
          segment.length <= MAX_SEGMENT &&
          !WINDOWS_RESERVED.test(segment)
      )
  )
}

function isInside(root, target) {
  const relative = path.relative(root, target)
  return !(
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  )
}

function realTarget(target, file) {
  const rest = []
  for (let current = target; ; current = path.dirname(current)) {
    try {
      return path.join(realpathSync(current), ...rest)
    } catch (error) {
      if (error.code === "ENAMETOOLONG") {
        throw new CliError(`Refusing to write ${file}: the path is too long.`)
      }
      if (error.code !== "ENOENT" || path.dirname(current) === current) {
        throw error
      }
      if (lstatSync(current, { throwIfNoEntry: false })) {
        throw new CliError(`Refusing to write ${file} through a broken link.`)
      }
      rest.unshift(path.basename(current))
    }
  }
}

function allowedTarget(file, { directories, extensions, excluded = [] }) {
  const segments = file.split("/")
  const name = segments.at(-1)
  return (
    (!directories ||
      (segments.length > 1 && directories.includes(segments[0]))) &&
    !segments
      .slice(0, -1)
      .some((segment) => excluded.includes(segment.toLowerCase())) &&
    extensions.includes(path.extname(name)) &&
    !EXECUTABLE_NAME.test(name)
  )
}

function describeTargets({ directories, extensions, excluded }) {
  const kinds = extensions.join(", ")
  if (directories) {
    return `${kinds} files in ${directories.map((dir) => `${dir}/`).join(", ")}`
  }
  return excluded ? `${kinds} files outside build folders` : `${kinds} files`
}

export function targetFor(root, file, kind = "web") {
  const target = typeof file === "string" && path.resolve(root, file)
  if (
    !target ||
    path.isAbsolute(file) ||
    path.win32.isAbsolute(file) ||
    file.split(SEPARATORS).includes("..") ||
    !isInside(root, target)
  ) {
    throw new CliError(`Refusing to write ${file} outside the project.`)
  }
  const rules = TARGETS[kind]
  if (!isRegistryPath(file) || !allowedTarget(file, rules)) {
    throw new CliError(
      `Refusing to write ${file}. Registry files can only be ${describeTargets(rules)} with short, portable names.`
    )
  }
  if (!isInside(realTarget(root, file), realTarget(target, file))) {
    throw new CliError(`Refusing to write ${file} outside the project.`)
  }
  return target
}

export async function mapLimit(entries, fn) {
  const results = new Array(entries.length)
  let next = 0
  const worker = async () => {
    while (next < entries.length) {
      const index = next++
      results[index] = await fn(entries[index])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, entries.length) }, worker)
  )
  return results
}

export function writeFiles(cwd, files, overwrite) {
  const created = []
  const updated = []
  const skipped = []

  for (const { target, content } of files) {
    const relative = path.relative(cwd, target)
    if (!existsSync(target)) {
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, content)
      created.push(relative)
    } else if (readFileSync(target, "utf8") !== content) {
      if (overwrite) {
        writeFileSync(target, content)
        updated.push(relative)
      } else {
        skipped.push(relative)
      }
    }
  }
  return { created, updated, skipped }
}

export function reportFiles({ created, updated, skipped }, installed = []) {
  if (created.length) {
    step(`Created ${created.length} file${created.length === 1 ? "" : "s"}:`)
    list(created)
  }
  if (updated.length) {
    step(`Updated ${updated.length} file${updated.length === 1 ? "" : "s"}:`)
    list(updated)
  }
  if (installed.length) step(`Installed ${installed.join(", ")}`)
  if (skipped.length) {
    note(
      `Kept ${skipped.length} local file${skipped.length === 1 ? " that differs" : "s that differ"} from the registry. Review with --diff, replace with --overwrite:`
    )
    list(skipped)
  }
  if (!created.length && !updated.length && !skipped.length) {
    step("Already up to date.")
  }
}

export function printDiff(cwd, files) {
  let changes = 0

  for (const { target, content } of files) {
    const relative = path.relative(cwd, target)
    if (!existsSync(target)) {
      note(`${relative} is not installed.`)
      continue
    }
    const diff = formatDiff(
      revealed(readFileSync(target, "utf8")),
      revealed(content)
    )
    if (!diff) continue
    changes++
    console.log(`\n${color.bold(printable(relative))}\n${diff}`)
  }

  if (!changes) step("No differences from the registry.")
}
