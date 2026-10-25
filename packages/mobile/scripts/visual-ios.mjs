import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { PNG } from "pngjs"
import { BUNDLE, options, run } from "./visual-native.mjs"

const STATUS_BAR = 186
const READY_MARKER = { x: 15, y: 165 }
const HOME_INDICATOR = 102

const values = options("iPhone 17 Pro Max")

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

function prepare() {
  if (device.state !== "Booted") simctl("boot", device.udid)
  simctl("bootstatus", device.udid, "-b")
  simctl(
    "spawn",
    device.udid,
    "defaults",
    "write",
    "com.apple.Accessibility",
    "ReduceMotionEnabled",
    "-bool",
    "true"
  )
  simctl(
    "spawn",
    device.udid,
    "defaults",
    "write",
    "com.apple.keyboard.preferences",
    "KeyboardPrediction",
    "-bool",
    "false"
  )
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

function running() {
  return simctl("spawn", device.udid, "launchctl", "list").includes(
    `UIKitApplication:${BUNDLE}`
  )
}

function open(name) {
  simctl(
    "launch",
    "--terminate-running-process",
    device.udid,
    BUNDLE,
    "-example",
    name,
    "-capture",
    "1"
  )
}

function screenshot(file) {
  simctl("io", device.udid, "screenshot", "--type=png", file)
  const full = PNG.sync.read(readFileSync(file))
  const height = full.height - STATUS_BAR - HOME_INDICATOR
  const content = new PNG({ width: full.width, height })
  PNG.bitblt(full, content, 0, STATUS_BAR, full.width, height, 0, 0)
  return { content, ready: ready(full) }
}

function ready(full) {
  const index = (READY_MARKER.y * full.width + READY_MARKER.x) * 4
  const [red, green, blue] = full.data.subarray(index, index + 3)
  return red - green > 60 && blue - green > 60 && Math.abs(red - blue) < 30
}

function finish() {
  simctl("terminate", device.udid, BUNDLE)
  simctl("status_bar", device.udid, "clear")
  simctl(
    "spawn",
    device.udid,
    "defaults",
    "write",
    "com.apple.Accessibility",
    "ReduceMotionEnabled",
    "-bool",
    "false"
  )
  simctl(
    "spawn",
    device.udid,
    "defaults",
    "write",
    "com.apple.keyboard.preferences",
    "KeyboardPrediction",
    "-bool",
    "true"
  )
}

const device = findDevice(values.device)

await run(
  {
    name: "ios",
    prepare,
    install: (app) => simctl("install", device.udid, app),
    open,
    screenshot,
    running,
    theme: (theme) => simctl("ui", device.udid, "appearance", theme),
    finish,
  },
  values
)
