import { execFileSync } from "node:child_process"

export function simctl(...args) {
  return execFileSync("xcrun", ["simctl", ...args], { encoding: "utf8" })
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

export function findDevice(name) {
  const { devices } = JSON.parse(simctl("list", "devices", "available", "-j"))
  const matches = Object.entries(devices)
    .filter(([runtime]) => runtime.includes("iOS"))
    .flatMap(([, list]) => list)
    .filter((device) => device.name === name)
  const device =
    matches.find((candidate) => candidate.state === "Booted") ?? matches.at(-1)
  return device ?? createDevice(name)
}

export function setDefault(udid, domain, key, value) {
  simctl("spawn", udid, "defaults", "write", domain, key, "-bool", value)
}
