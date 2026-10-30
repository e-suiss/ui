import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { setTimeout as wait } from "node:timers/promises"
import { PNG } from "pngjs"
import { findDevice, setDefault, simctl } from "./simulator.mjs"
import {
  ALLOWED_MISMATCHED_PIXELS,
  compare,
  options,
  readReference,
} from "./visual-native.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const BUNDLE = "com.esuiss.catalog"
const THEMES = ["light", "dark"]
const POLL = 2000
const PASS_TIMEOUT = 60 * 60_000
const DONE = "done.txt"

const values = options("iPhone 17 Pro Max")
const device = findDevice(values.device)
const references = path.join(ROOT, "tests/screenshots/mobile/swiftui")
const diffs = path.join(ROOT, ".visual/swiftui")

function running() {
  return simctl("spawn", device.udid, "launchctl", "list").includes(
    `UIKitApplication:${BUNDLE}`
  )
}

function captured(folder) {
  return existsSync(folder)
    ? readdirSync(folder).filter((file) => file.endsWith(".png")).length
    : 0
}

async function take(shard, only) {
  const container = simctl("get_app_container", device.udid, BUNDLE, "data")
  const folder = path.join(container.trim(), "Documents/snapshots")
  rmSync(folder, { recursive: true, force: true })
  const args = ["-snapshots", shard]
  if (only.length) args.push("-only", only.join(","))
  simctl("launch", "--terminate-running-process", device.udid, BUNDLE, ...args)
  const deadline = Date.now() + PASS_TIMEOUT
  let reported = 0
  while (!existsSync(path.join(folder, DONE))) {
    await wait(POLL)
    const count = captured(folder)
    if (count - reported >= 50) {
      console.log(`${count} screenshots taken`)
      reported = count
    }
    if (Date.now() > deadline) {
      console.error(`The catalog did not finish after ${count} screenshots.`)
      process.exit(1)
    }
    if (!existsSync(path.join(folder, DONE)) && !running()) {
      console.error(`The catalog stopped after ${count} screenshots.`)
      process.exit(1)
    }
  }
  const ids = readFileSync(path.join(folder, DONE), "utf8")
    .split("\n")
    .filter(Boolean)
  return { folder, ids }
}

function difference(name, image) {
  const stored = readReference(path.join(references, `${name}.png`))
  if (!stored) return "the reference screenshot cannot be read"
  const { mismatched, diff } = compare(stored, image)
  if (mismatched <= ALLOWED_MISMATCHED_PIXELS) return undefined
  writeFileSync(path.join(diffs, `${name}-actual.png`), PNG.sync.write(image))
  if (diff) {
    writeFileSync(path.join(diffs, `${name}-diff.png`), PNG.sync.write(diff))
  }
  return Number.isFinite(mismatched)
    ? `${mismatched} pixels differ`
    : "the screenshot size changed"
}

function finish() {
  simctl("terminate", device.udid, BUNDLE)
  setDefault(
    device.udid,
    "com.apple.Accessibility",
    "ReduceMotionEnabled",
    "false"
  )
}

if (device.state !== "Booted") simctl("boot", device.udid)
simctl("bootstatus", device.udid, "-b")
setDefault(
  device.udid,
  "com.apple.Accessibility",
  "ReduceMotionEnabled",
  "true"
)
if (values.app) simctl("install", device.udid, path.resolve(values.app))
rmSync(diffs, { recursive: true, force: true })
mkdirSync(diffs, { recursive: true })
mkdirSync(references, { recursive: true })

const filter = values.only
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean)
const first = await take(values.shard, filter)
if (!first.ids.length) {
  if (filter.length) {
    console.log("None of the stories belong to this shard.")
    finish()
    process.exit(0)
  }
  console.error("The catalog has no stories to take.")
  process.exit(1)
}
const shots = first.ids.flatMap((id) =>
  THEMES.map((theme) => ({
    id,
    name: `${id}-${theme}`,
    label: `${id} (${theme})`,
  }))
)

const failures = new Map()
const recheck = new Set()
let written = 0

for (const shot of shots) {
  const image = readReference(path.join(first.folder, `${shot.name}.png`))
  const reference = path.join(references, `${shot.name}.png`)
  if (!image) {
    failures.set(shot.name, `${shot.label}: was not taken`)
  } else if (values.update || !existsSync(reference)) {
    writeFileSync(reference, PNG.sync.write(image))
    written++
    recheck.add(shot.name)
  } else {
    const failure = difference(shot.name, image)
    if (failure) {
      failures.set(shot.name, `${shot.label}: ${failure}`)
      recheck.add(shot.name)
    }
  }
}

if (recheck.size) {
  const again = shots.filter((shot) => recheck.has(shot.name))
  const second = await take("1/1", [...new Set(again.map((shot) => shot.id))])
  for (const shot of again) {
    const image = readReference(path.join(second.folder, `${shot.name}.png`))
    const failure = image ? difference(shot.name, image) : "was not taken"
    if (!failure) {
      failures.delete(shot.name)
      rmSync(path.join(diffs, `${shot.name}-actual.png`), { force: true })
      rmSync(path.join(diffs, `${shot.name}-diff.png`), { force: true })
    } else if (values.update) {
      failures.set(shot.name, `${shot.label}: changes between two captures`)
    } else {
      failures.set(shot.name, `${shot.label}: ${failure}`)
    }
  }
}

if (values.update) {
  const kept = new Set(shots.map((shot) => `${shot.name}.png`))
  for (const file of readdirSync(references)) {
    if (!kept.has(file)) rmSync(path.join(references, file))
  }
}

finish()
console.log(
  `${shots.length} screenshots, ${written} written, ${failures.size} failed`
)
for (const failure of failures.values()) console.error(failure)
if (failures.size) process.exit(1)
