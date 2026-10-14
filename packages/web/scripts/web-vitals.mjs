import { readFileSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"
import { chromium } from "playwright"

const ROOT = "storybook-static"
const STORIES = [
  "blocks-dashboard--store",
  "blocks-hero--cinematic",
  "blocks-inbox--mail",
  "blocks-users--list",
  "blocks-settings--device",
  "blocks-bag--review",
  "components-carousel--featured",
  "components-dialog--default",
  "components-select--default",
]
const GOOD = { cls: 0.1, inp: 200 }
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
}

const server = createServer((request, response) => {
  const path = normalize(
    decodeURIComponent(new URL(request.url, "http://x").pathname)
  )
  const file = join(ROOT, path.endsWith("/") ? `${path}index.html` : path)
  try {
    if (!statSync(file).isFile()) throw new Error("not a file")
    response.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    })
    response.end(readFileSync(file))
  } catch {
    response.writeHead(404)
    response.end()
  }
})
await new Promise((resolve) => server.listen(0, resolve))
const origin = `http://localhost:${server.address().port}`

const observe = () => {
  const vitals = { lcp: 0, cls: 0, inp: 0 }
  Object.assign(window, { vitals })
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) vitals.lcp = entry.startTime
  }).observe({ type: "largest-contentful-paint", buffered: true })
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) vitals.cls += entry.value
    }
  }).observe({ type: "layout-shift", buffered: true })
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      vitals.inp = Math.max(vitals.inp, entry.duration)
    }
  }).observe({ type: "event", buffered: true, durationThreshold: 16 })
}

const browser = await chromium.launch({ channel: "chrome" })
const rows = []
for (const story of STORIES) {
  const context = await browser.newContext({
    viewport: { width: 412, height: 839 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send("Network.enable")
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  })
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 })
  await page.addInitScript(observe)
  await page.goto(`${origin}/iframe.html?id=${story}&viewMode=story`, {
    waitUntil: "load",
    timeout: 120_000,
  })
  await page.waitForTimeout(4000)
  const loadShift = await page.evaluate(() => window.vitals.cls)
  const target = page
    .locator("#storybook-root")
    .locator("button:visible, a:visible, [role=tab]:visible")
    .first()
  if (await target.count())
    await target.tap({ timeout: 10_000 }).catch(() => undefined)
  await page.waitForTimeout(1500)
  const vitals = await page.evaluate(() => window.vitals)
  rows.push({ story, ...vitals, cls: loadShift })
  await context.close()
}
await browser.close()
server.close()

let failed = 0
for (const { story, lcp, cls, inp } of rows) {
  const flags = [cls > GOOD.cls && "CLS", inp > GOOD.inp && "INP"].filter(
    Boolean
  )
  if (flags.length > 0) failed++
  console.log(
    `${story.padEnd(34)} LCP ${String(Math.round(lcp)).padStart(5)} ms  CLS ${cls.toFixed(3)}  INP ${String(Math.round(inp)).padStart(4)} ms  ${flags.length ? `over: ${flags.join(", ")}` : "good"}`
  )
}
console.log(
  `\n${failed} of ${rows.length} pages over the CLS or INP thresholds. LCP includes loading Storybook itself and is shown for comparison only.`
)
process.exitCode = failed === 0 ? 0 : 1
