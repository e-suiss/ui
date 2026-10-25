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
const BOOT_TIMEOUT = 300_000

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

function demo(command, extras = {}) {
  shell(
    "am",
    "broadcast",
    "-a",
    "com.android.systemui.demo",
    "-e",
    "command",
    command,
    ...Object.entries(extras).flatMap(([key, value]) => ["-e", key, value])
  )
}

async function prepare() {
  adb("wait-for-device")
  const deadline = Date.now() + BOOT_TIMEOUT
  while (shell("getprop", "sys.boot_completed").trim() !== "1") {
    if (Date.now() > deadline) {
      console.error("The emulator did not finish booting.")
      process.exit(1)
    }
    await wait(1000)
  }
  for (const scale of [
    "window_animation_scale",
    "transition_animation_scale",
    "animator_duration_scale",
  ]) {
    shell("settings", "put", "global", scale, "0")
  }
  shell("settings", "put", "secure", "show_ime_with_hard_keyboard", "1")
  shell("settings", "put", "global", "sysui_demo_allowed", "1")
  demo("enter")
  demo("clock", { hhmm: "0941" })
  demo("battery", { level: "100", plugged: "false" })
  demo("network", { wifi: "show", level: "4", fully: "true" })
  demo("network", { mobile: "show", datatype: "none", level: "4" })
  demo("notifications", { visible: "false" })
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
  return { content: PNG.sync.read(data), ready: settled && ready() }
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
  demo("exit")
  for (const scale of [
    "window_animation_scale",
    "transition_animation_scale",
    "animator_duration_scale",
  ]) {
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
