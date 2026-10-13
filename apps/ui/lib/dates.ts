import { execFileSync } from "node:child_process";
import path from "node:path";

type Dates = { published?: Date; modified?: Date };

const cache = new Map<string, Dates>();

export function contentDates(file: string): Dates {
  const cached = cache.get(file);
  if (cached) return cached;
  let commits: string[] = [];
  try {
    commits = execFileSync("git", ["log", "--follow", "--format=%cI", "--", path.join("content/docs", file)], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
  } catch {}
  const dates = commits.length > 0 ? { modified: new Date(commits[0]), published: new Date(commits[commits.length - 1]) } : {};
  cache.set(file, dates);
  return dates;
}
