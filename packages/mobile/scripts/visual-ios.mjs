import { readFileSync } from "node:fs"
import { PNG } from "pngjs"
import { findDevice, setDefault, simctl } from "./simulator.mjs"
import { BUNDLE, options, run } from "./visual-native.mjs"

const STATUS_BAR = 186
const READY_MARKER = { x: 15, y: 165 }
const HOME_INDICATOR = 102

const values = options("iPhone 17 Pro Max")

function prepare() {
  if (device.state !== "Booted") simctl("boot", device.udid)
  simctl("bootstatus", device.udid, "-b")
  setDefault(
    device.udid,
    "com.apple.Accessibility",
    "ReduceMotionEnabled",
    "true"
  )
  setDefault(
    device.udid,
    "com.apple.keyboard.preferences",
    "KeyboardPrediction",
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
  setDefault(
    device.udid,
    "com.apple.Accessibility",
    "ReduceMotionEnabled",
    "false"
  )
  setDefault(
    device.udid,
    "com.apple.keyboard.preferences",
    "KeyboardPrediction",
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
