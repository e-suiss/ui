import { cdp, commands } from "vitest/browser"

export type FrameStats = {
  frames: number
  p95: number
  worst: number
  long: number
}

export function throttle(rate: number) {
  return cdp().send("Emulation.setCPUThrottlingRate", { rate })
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function frameStats(action: () => Promise<unknown>) {
  const stamps: number[] = []
  let running = true
  const tick = (time: number) => {
    stamps.push(time)
    if (running) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  await action()
  await wait(100)
  running = false
  const gaps = stamps.slice(1).map((time, index) => time - (stamps[index] ?? 0))
  const sorted = [...gaps].sort((a, b) => a - b)
  return {
    frames: gaps.length,
    p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
    worst: Math.round(sorted.at(-1) ?? 0),
    long: gaps.filter((gap) => gap > 50).length,
  } satisfies FrameStats
}

function frameOffset() {
  const frame = window.frameElement?.getBoundingClientRect()
  return { x: frame?.left ?? 0, y: frame?.top ?? 0 }
}

type MouseType = "mouseMoved" | "mousePressed" | "mouseReleased"

function mouse(type: MouseType, x: number, y: number, buttons = 0) {
  return cdp().send("Input.dispatchMouseEvent", {
    type,
    x,
    y,
    button: type === "mouseMoved" ? "none" : "left",
    buttons,
    clickCount: type === "mouseMoved" ? 0 : 1,
  })
}

export async function drag(
  element: Element,
  dx: number,
  dy: number,
  steps = 30
) {
  const box = element.getBoundingClientRect()
  const offset = frameOffset()
  const x = offset.x + box.left + box.width / 2
  const y = offset.y + box.top + box.height / 2
  await mouse("mouseMoved", x, y)
  await mouse("mousePressed", x, y, 1)
  for (let step = 1; step <= steps; step++) {
    await mouse(
      "mouseMoved",
      x + (dx * step) / steps,
      y + (dy * step) / steps,
      1
    )
  }
  await mouse("mouseReleased", x + dx, y + dy)
}

export async function heapUsed() {
  await cdp().send("HeapProfiler.collectGarbage")
  const { usedSize } = (await cdp().send("Runtime.getHeapUsage")) as {
    usedSize: number
  }
  return usedSize
}

type Listener = {
  target: EventTarget
  type: string
  listener: unknown
  capture: boolean
}

export function trackListeners() {
  const active: Listener[] = []
  const add = EventTarget.prototype.addEventListener
  const remove = EventTarget.prototype.removeEventListener
  const captureOf = (options: unknown) =>
    typeof options === "boolean"
      ? options
      : Boolean((options as AddEventListenerOptions | undefined)?.capture)
  const watched = (target: EventTarget) =>
    target === window || target === document
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (watched(this) && listener) {
      active.push({ target: this, type, listener, capture: captureOf(options) })
    }
    return add.call(this, type, listener, options)
  }
  EventTarget.prototype.removeEventListener = function (
    type,
    listener,
    options
  ) {
    const capture = captureOf(options)
    const index = active.findIndex(
      (entry) =>
        entry.target === this &&
        entry.type === type &&
        entry.listener === listener &&
        entry.capture === capture
    )
    if (index !== -1) active.splice(index, 1)
    return remove.call(this, type, listener, options)
  }
  return {
    count: () => active.length,
    types: () => active.map((entry) => entry.type),
    stop: () => {
      EventTarget.prototype.addEventListener = add
      EventTarget.prototype.removeEventListener = remove
    },
  }
}

export function report(name: string, data: unknown) {
  return commands.writeFile(
    `.vitest/perf/${name}.json`,
    JSON.stringify(data, null, 2)
  )
}
