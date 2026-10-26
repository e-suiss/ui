import { execFileSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import path from "node:path"
import { setTimeout as wait } from "node:timers/promises"
import { PNG } from "pngjs"
import { BUNDLE, options, run } from "./visual-native.mjs"

const ADB = process.env.ANDROID_HOME
  ? path.join(process.env.ANDROID_HOME, "platform-tools/adb")
  : "adb"
const READY = /esuiss-capture (ready|busy)/g
const SYSTEM_DIALOG = /Not Responding|Application Error/
const BOOT_TIMEOUT = 300_000
const BARS_SETTLED = 10_000
const ANIMATIONS = [
  "window_animation_scale",
  "transition_animation_scale",
  "animator_duration_scale",
]

const values = options("")
const SERIAL = values.device ? ["-s", values.device] : []

function adb(...args) {
  return execFileSync(ADB, [...SERIAL, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
}

function shell(...args) {
  return adb("shell", ...args)
}

let insets = { top: 0, bottom: 0 }

function inset(windows, type) {
  const heights = [
    ...windows.matchAll(
      new RegExp(`type=${type} frame=\\[\\d+,(\\d+)\\]\\[\\d+,(\\d+)\\]`, "g")
    ),
  ].map((frame) => Number(frame[2]) - Number(frame[1]))
  return heights.length ? Math.max(...heights) : undefined
}

async function prepare() {
  adb("wait-for-device")
  const deadline = Date.now() + BOOT_TIMEOUT
  let settled = 0
  let previous = ""
  while (Date.now() - settled < BARS_SETTLED || !settled) {
    if (Date.now() > deadline) {
      console.error("The emulator did not finish booting.")
      process.exit(1)
    }
    await wait(1000)
    if (shell("getprop", "sys.boot_completed").trim() !== "1") continue
    const windows = shell("dumpsys", "window")
    const top = Math.max(
      inset(windows, "statusBars") ?? 0,
      inset(windows, "displayCutout") ?? 0
    )
    const bottom = inset(windows, "navigationBars") ?? 0
    const current = `${top},${bottom}`
    if (!top || !bottom) {
      settled = 0
    } else if (current !== previous) {
      settled = Date.now()
      insets = { top, bottom }
    }
    previous = current
  }
  for (const scale of ANIMATIONS) {
    shell("settings", "put", "global", scale, "0")
  }
  shell("settings", "put", "secure", "show_ime_with_hard_keyboard", "1")
  shell("settings", "put", "global", "hide_error_dialogs", "1")
  shell("settings", "put", "secure", "anr_show_background", "0")
  console.log(
    `Cropping ${insets.top}px from the top and ${insets.bottom}px from the bottom`
  )
}

function open(name) {
  adb("logcat", "-c")
  shell(
    "am",
    "start",
    "-S",
    "-W",
    "-a",
    "android.intent.action.VIEW",
    "-d",
    `'esuiss-ui://example/${name}?capture'`,
    BUNDLE
  )
}

function ready() {
  const focus = shell("dumpsys window | grep mCurrentFocus || true")
  if (SYSTEM_DIALOG.test(focus)) return false
  const log = adb("logcat", "-d", "-s", "ReactNativeJS:I")
  const states = [...log.matchAll(READY)]
  return states.at(-1)?.[1] === "ready"
}

function screenshot(file) {
  const settled = ready()
  const data = execFileSync(ADB, [...SERIAL, "exec-out", "screencap", "-p"], {
    maxBuffer: 64 * 1024 * 1024,
  })
  writeFileSync(file, data)
  const full = PNG.sync.read(data)
  const height = full.height - insets.top - insets.bottom
  const content = new PNG({ width: full.width, height })
  PNG.bitblt(full, content, 0, insets.top, full.width, height, 0, 0)
  return { content, ready: settled && ready() }
}

function running() {
  try {
    return shell("pidof", BUNDLE).trim() !== ""
  } catch {
    return false
  }
}

function finish() {
  shell("am", "force-stop", BUNDLE)
  for (const scale of ANIMATIONS) {
    shell("settings", "put", "global", scale, "1")
  }
}

await run(
  {
    name: "android",
    prepare,
    install: (app) => adb("install", "-r", "-g", app),
    open,
    screenshot,
    running,
    theme: (theme) =>
      shell("cmd", "uimode", "night", theme === "dark" ? "yes" : "no"),
    finish,
  },
  values
)
