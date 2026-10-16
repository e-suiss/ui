import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"

type Dates = { published?: Date; modified?: Date }

type Stored = Record<string, { published: string; modified: string }>

const cache = new Map<string, Dates>()

let stored: Stored | undefined

function storedDates(): Stored {
  if (stored) return stored
  try {
    stored = JSON.parse(
      readFileSync(path.join(process.cwd(), "content-dates.json"), "utf8")
    ) as Stored
  } catch {
    stored = {}
  }
  return stored
}

function gitCommits(file: string): string[] {
  try {
    return execFileSync(
      "git",
      [
        "log",
        "--follow",
        "--format=%cI",
        "--",
        path.join("content/docs", file),
      ],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    )
      .split("\n")
      .filter(Boolean)
  } catch {
    return []
  }
}

function lookup(file: string) {
  const entry = storedDates()[file.split(path.sep).join("/")]
  if (entry) return entry
  const commits = gitCommits(file)
  const modified = commits[0]
  const published = commits.at(-1)
  return modified && published ? { modified, published } : undefined
}

export function contentDates(file: string): Dates {
  const cached = cache.get(file)
  if (cached) return cached
  const entry = lookup(file)
  const dates = entry
    ? {
        modified: new Date(entry.modified),
        published: new Date(entry.published),
      }
    : {}
  cache.set(file, dates)
  return dates
}
