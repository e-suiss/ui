import { execFileSync } from "node:child_process"
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
import { parseArgs } from "node:util"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const EXAMPLES = path.join(ROOT, "examples")
const REFERENCES = path.join(ROOT, "tests/screenshots/mobile/ios")
const DIFFS = path.join(ROOT, ".visual/ios")
const BUNDLE = "com.esuiss.ui"
const THEMES = ["light", "dark"]
const POLL = 400
const SETTLE_AFTER_THEME = 1500
const STARTUP = 1500
const STABLE_TIMEOUT = 10_000
const ALLOWED_MISMATCHED_PIXELS = 10
const STATUS_BAR = 186
const HOME_INDICATOR = 102
const EXAMPLE_FILE = /\.tsx$/

const { values } = parseArgs({
  options: {
    app: { type: "string", default: "" },
    device: { type: "string", default: "iPhone 17 Pro Max" },
    only: { type: "string", default: "" },
    update: { type: "boolean", default: false },
  },
})

function simctl(...args) {
  return execFileSync("xcrun", ["simctl", ...args], { encoding: "utf8" })
}

function findDevice(name) {
  const { devices } = JSON.parse(simctl("list", "devices", "available", "-j"))
  const matches = Object.entries(devices)
    .filter(([runtime]) => runtime.includes("iOS"))
    .flatMap(([, list]) => list)
    .filter((device) => device.name === name)
  const device =
    matches.find((candidate) => candidate.state === "Booted") ?? matches.at(-1)
  return device ?? createDevice(name)
}

function createDevice(name) {
  const { devicetypes } = JSON.parse(simctl("list", "devicetypes", "-j"))
  const { runtimes } = JSON.parse(simctl("list", "runtimes", "available", "-j"))
  const type = devicetypes.find((candidate) => candidate.name === name)
  const runtime = runtimes
    .filter((candidate) => candidate.platform === "iOS")
    .at(-1)
  if (!type || !runtime) {
    console.error(`Cannot create a simulator named "${name}".`)
    process.exit(1)
  }
  const udid = simctl(
    "create",
    name,
    type.identifier,
    runtime.identifier
  ).trim()
  return { name, udid, state: "Shutdown" }
}

function prepare(device) {
  if (device.state !== "Booted") simctl("boot", device.udid)
  simctl("bootstatus", device.udid, "-b")
  simctl(
    "status_bar",
    device.udid,
    "override",
    "--time",
    "9:41",
    "--dataNetwork",
    "wifi",
    "--wifiMode",
    "active",
    "--wifiBars",
    "3",
    "--cellularMode",
    "active",
    "--cellularBars",
    "4",
    "--batteryState",
    "charged",
    "--batteryLevel",
    "100"
  )
}

function running(udid) {
  return simctl("spawn", udid, "launchctl", "list").includes(
    `UIKitApplication:${BUNDLE}`
  )
}

function open(udid, name) {
  simctl(
    "launch",
    "--terminate-running-process",
    udid,
    BUNDLE,
    "-example",
    name,
    "-capture",
    "1"
  )
}

function screenshot(udid, file) {
  simctl("io", udid, "screenshot", "--type=png", file)
  const full = PNG.sync.read(readFileSync(file))
  const height = full.height - STATUS_BAR - HOME_INDICATOR
  const content = new PNG({ width: full.width, height })
  PNG.bitblt(full, content, 0, STATUS_BAR, full.width, height, 0, 0)
  return content
}

function same(a, b) {
  return (
    a.width === b.width &&
    a.height === b.height &&
    Buffer.compare(a.data, b.data) === 0
  )
}

async function stableShot(udid, file) {
  const deadline = Date.now() + STABLE_TIMEOUT
  let previous = screenshot(udid, file)
  while (Date.now() < deadline) {
    await wait(POLL)
    const current = screenshot(udid, file)
    if (same(previous, current)) return current
    previous = current
  }
  return undefined
}

function compare(reference, actual) {
  if (reference.width !== actual.width || reference.height !== actual.height) {
    return { mismatched: Number.POSITIVE_INFINITY }
  }
  const diff = new PNG({ width: actual.width, height: actual.height })
  const mismatched = pixelmatch(
    reference.data,
    actual.data,
    diff.data,
    actual.width,
    actual.height,
    { threshold: 0.1 }
  )
  return { mismatched, diff }
}

async function capture(udid, name, theme) {
  const shot = path.join(DIFFS, `${name}-${theme}-actual.png`)
  for (let attempt = 0; attempt < 2; attempt++) {
    open(udid, name)
    await wait(STARTUP)
    const image = await stableShot(udid, shot)
    if (image && running(udid)) return { image, shot }
  }
  return { shot }
}

const filter = values.only
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean)
const examples = readdirSync(EXAMPLES)
  .filter((file) => EXAMPLE_FILE.test(file))
  .map((file) => file.replace(EXAMPLE_FILE, ""))
  .filter((name) => !filter.length || filter.includes(name))
  .sort()

const device = findDevice(values.device)
prepare(device)
if (values.app) simctl("install", device.udid, path.resolve(values.app))
rmSync(DIFFS, { recursive: true, force: true })
mkdirSync(DIFFS, { recursive: true })
mkdirSync(REFERENCES, { recursive: true })

const failures = []
let written = 0
for (const theme of THEMES) {
  simctl("ui", device.udid, "appearance", theme)
  await wait(SETTLE_AFTER_THEME)
  for (const name of examples) {
    const { image, shot } = await capture(device.udid, name, theme)
    const label = `${name} (${theme})`
    if (!image) {
      failures.push(`${label}: did not settle or the app stopped`)
      continue
    }
    const reference = path.join(REFERENCES, `${name}-${theme}.png`)
    if (values.update || !existsSync(reference)) {
      writeFileSync(reference, PNG.sync.write(image))
      rmSync(shot)
      written++
      continue
    }
    const { mismatched, diff } = compare(
      PNG.sync.read(readFileSync(reference)),
      image
    )
    if (mismatched <= ALLOWED_MISMATCHED_PIXELS) {
      rmSync(shot)
      continue
    }
    writeFileSync(shot, PNG.sync.write(image))
    if (diff) {
      writeFileSync(
        path.join(DIFFS, `${name}-${theme}-diff.png`),
        PNG.sync.write(diff)
      )
    }
    failures.push(
      Number.isFinite(mismatched)
        ? `${label}: ${mismatched} pixels differ`
        : `${label}: the screenshot size changed`
    )
  }
}

simctl("terminate", device.udid, BUNDLE)
simctl("status_bar", device.udid, "clear")
console.log(
  `${examples.length * THEMES.length} screenshots, ${written} written, ${failures.length} failed`
)
for (const failure of failures) console.error(failure)
if (failures.length) process.exit(1)
