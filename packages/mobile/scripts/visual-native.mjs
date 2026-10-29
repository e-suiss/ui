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
const THEMES = ["light", "dark"]
const POLL = 400
const SETTLE_AFTER_THEME = 1500
const STARTUP = 1500
const WARM_UP = 15_000
const CONFIRM_DELAY = 8000
const STABLE_TIMEOUT = 60_000
const ALLOWED_MISMATCHED_PIXELS = 10
const EXAMPLE_FILE = /\.tsx$/

export const BUNDLE = "com.esuiss.ui"

export function options(device) {
  return parseArgs({
    options: {
      app: { type: "string", default: "" },
      device: { type: "string", default: device },
      only: { type: "string", default: "" },
      shard: { type: "string", default: "1/1" },
      update: { type: "boolean", default: false },
    },
  }).values
}

function same(a, b) {
  return (
    a.width === b.width &&
    a.height === b.height &&
    Buffer.compare(a.data, b.data) === 0
  )
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

function matches(reference, image) {
  return compare(reference, image).mismatched <= ALLOWED_MISMATCHED_PIXELS
}

export async function run(driver, values) {
  const references = path.join(ROOT, "tests/screenshots/mobile", driver.name)
  const diffs = path.join(ROOT, ".visual", driver.name)

  async function stableShot(file) {
    const deadline = Date.now() + STABLE_TIMEOUT
    let previous = driver.screenshot(file)
    while (Date.now() < deadline) {
      await wait(POLL)
      const current = driver.screenshot(file)
      if (current.ready && previous.ready) {
        if (same(previous.content, current.content)) return current.content
      }
      previous = current
    }
    return undefined
  }

  async function capture(name, theme) {
    const shot = path.join(diffs, `${name}-${theme}-actual.png`)
    for (let attempt = 0; attempt < 2; attempt++) {
      driver.open(name)
      await wait(STARTUP)
      const image = await stableShot(shot)
      if (image && driver.running()) return { image, shot }
    }
    return { shot }
  }

  const filter = values.only
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
  const [shard, shards] = values.shard.split("/").map(Number)
  const examples = readdirSync(EXAMPLES)
    .filter((file) => EXAMPLE_FILE.test(file))
    .map((file) => file.replace(EXAMPLE_FILE, ""))
    .filter((name) => !filter.length || filter.includes(name))
    .sort()
    .filter((_, index) => index % shards === shard - 1)

  await driver.prepare()
  if (values.app) driver.install(path.resolve(values.app))
  rmSync(diffs, { recursive: true, force: true })
  mkdirSync(diffs, { recursive: true })
  mkdirSync(references, { recursive: true })
  const sample = readdirSync(references).find((file) => file.endsWith(".png"))
  const expected =
    sample && PNG.sync.read(readFileSync(path.join(references, sample)))
  if (examples.length) {
    driver.open(examples[0])
    await wait(WARM_UP)
  }
  if (examples.length && expected) {
    const screen = path.join(diffs, "screen.png")
    const { content } = driver.screenshot(screen)
    rmSync(screen)
    if (
      content.width !== expected.width ||
      content.height !== expected.height
    ) {
      console.error("The screen size does not match the reference screenshots.")
      process.exit(1)
    }
  }

  const failures = []
  let written = 0

  async function confirm(name, theme, first) {
    let previous = first
    for (let attempt = 0; attempt < 3; attempt++) {
      await wait(CONFIRM_DELAY)
      const { image, shot } = await capture(name, theme)
      if (!image) return {}
      if (matches(previous, image)) return { image, shot }
      previous = image
    }
    return {}
  }

  async function record(name, theme, label, reference) {
    const first = await capture(name, theme)
    if (!first.image) return `${label}: did not settle or the app stopped`
    if (existsSync(reference)) {
      const previous = PNG.sync.read(readFileSync(reference))
      if (
        previous.width !== first.image.width ||
        previous.height !== first.image.height
      ) {
        return `${label}: the screenshot size changed`
      }
      if (matches(previous, first.image)) {
        rmSync(first.shot)
        return undefined
      }
    }
    const { image, shot } = await confirm(name, theme, first.image)
    if (!image) return `${label}: did not settle or the app stopped`
    writeFileSync(reference, PNG.sync.write(image))
    rmSync(shot)
    written++
    return undefined
  }

  async function check(name, theme, label, reference) {
    if (values.update || !existsSync(reference)) {
      return record(name, theme, label, reference)
    }
    const { image, shot } = await capture(name, theme)
    if (!image) return `${label}: did not settle or the app stopped`
    const { mismatched, diff } = compare(
      PNG.sync.read(readFileSync(reference)),
      image
    )
    if (mismatched <= ALLOWED_MISMATCHED_PIXELS) {
      rmSync(shot)
      return undefined
    }
    writeFileSync(shot, PNG.sync.write(image))
    if (diff) {
      writeFileSync(
        path.join(diffs, `${name}-${theme}-diff.png`),
        PNG.sync.write(diff)
      )
    }
    return Number.isFinite(mismatched)
      ? `${label}: ${mismatched} pixels differ`
      : `${label}: the screenshot size changed`
  }

  for (const theme of THEMES) {
    driver.theme(theme)
    await wait(SETTLE_AFTER_THEME)
    for (const name of examples) {
      const label = `${name} (${theme})`
      const reference = path.join(references, `${name}-${theme}.png`)
      const started = Date.now()
      let failure
      for (let attempt = 0; attempt < 2; attempt++) {
        failure = await check(name, theme, label, reference)
        if (!failure) break
        await wait(CONFIRM_DELAY)
      }
      if (failure) failures.push(failure)
      console.log(
        `${failure ?? `${label}: ok`} in ${Math.round((Date.now() - started) / 1000)}s`
      )
    }
  }

  if (values.update && !filter.length) {
    const kept = new Set(
      examples.flatMap((name) => THEMES.map((theme) => `${name}-${theme}.png`))
    )
    for (const file of readdirSync(references)) {
      if (!kept.has(file)) rmSync(path.join(references, file))
    }
  }

  driver.finish()
  console.log(
    `${examples.length * THEMES.length} screenshots, ${written} written, ${failures.length} failed`
  )
  for (const failure of failures) console.error(failure)
  if (failures.length) process.exit(1)
}
