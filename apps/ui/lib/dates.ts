import { execFileSync } from "node:child_process"
import path from "node:path"

type Dates = { published?: Date; modified?: Date }

const cache = new Map<string, Dates>()

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

export function contentDates(file: string): Dates {
  const cached = cache.get(file)
  if (cached) return cached
  const commits = gitCommits(file)
  const [latest] = commits
  const earliest = commits.at(-1)
  const dates =
    latest && earliest
      ? {
          modified: new Date(latest),
          published: new Date(earliest),
        }
      : {}
  cache.set(file, dates)
  return dates
}
