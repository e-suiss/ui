import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"

const MANIFEST = "packages/cli/package.json"
const BRANCH = "main"
const USAGE = "Usage: pnpm release <patch|minor|major|x.y.z>"

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parse(version) {
  return version.split(".").map(Number)
}

function isNewer(candidate, current) {
  const next = parse(candidate)
  const previous = parse(current)
  for (let index = 0; index < 3; index++) {
    if (next[index] !== previous[index]) return next[index] > previous[index]
  }
  return false
}

function nextVersion(current, input) {
  const [major, minor, patch] = parse(current)
  if (input === "major") return `${major + 1}.0.0`
  if (input === "minor") return `${major}.${minor + 1}.0`
  if (input === "patch") return `${major}.${minor}.${patch + 1}`
  if (/^\d+\.\d+\.\d+$/.test(input)) return input
  fail(USAGE)
}

const input = process.argv[2]
if (!input) fail(USAGE)

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"))
const version = nextVersion(manifest.version, input)
const tag = `v${version}`
if (!isNewer(version, manifest.version)) {
  fail(`${version} must be newer than ${manifest.version}.`)
}

if (git("status", "--porcelain")) {
  fail("Commit or stash your changes before releasing.")
}
if (git("rev-parse", "--abbrev-ref", "HEAD") !== BRANCH) {
  fail(`Releases are made from ${BRANCH}.`)
}
git("fetch", "origin", BRANCH, "--tags")
if (git("rev-parse", "HEAD") !== git("rev-parse", `origin/${BRANCH}`)) {
  fail(`${BRANCH} is not in sync with origin/${BRANCH}. Pull or push first.`)
}

if (git("tag", "--list", tag)) fail(`${tag} already exists.`)

execFileSync("node", ["scripts/build-registry.mjs", "--check"], {
  stdio: "inherit",
})

manifest.version = version
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
git("add", MANIFEST)
git("commit", "-m", `chore(release): ${tag}`)
git("tag", "-a", tag, "-m", tag)
execFileSync("git", ["push", "origin", BRANCH, tag], { stdio: "inherit" })

console.log(
  `Pushed ${tag}. GitHub Actions publishes it to npm and creates the release.`
)
