const timeout = window.setTimeout.bind(window)
const interval = window.setInterval.bind(window)
const clear = window.clearTimeout.bind(window)
const pending = new Set<number>()
let held: Set<() => void> | undefined

function later(run: () => void) {
  const fire = () => (held ? held.add(fire) : run())
  return fire
}

window.setTimeout = ((handler: TimerHandler, ms = 0, ...args: unknown[]) => {
  if (typeof handler !== "function") return timeout(handler, ms, ...args)
  if (ms >= 1000) {
    return timeout(
      later(() => handler(...args)),
      ms
    )
  }
  const id = timeout(() => {
    pending.delete(id)
    handler(...args)
  }, ms)
  pending.add(id)
  return id
}) as typeof window.setTimeout

window.setInterval = ((handler: TimerHandler, ms = 0, ...args: unknown[]) => {
  if (typeof handler !== "function") return interval(handler, ms, ...args)
  return interval(
    later(() => handler(...args)),
    ms
  )
}) as typeof window.setInterval

window.clearTimeout = ((id?: number) => {
  if (id !== undefined) pending.delete(id)
  clear(id)
}) as typeof window.clearTimeout

export async function holdingTimers(run: () => Promise<void>) {
  held = new Set()
  try {
    await run()
  } finally {
    const queue = held
    held = undefined
    for (const fire of queue) fire()
  }
}

const loading = new Set<HTMLImageElement>()
const NativeImage = window.Image

window.Image = class extends NativeImage {
  constructor(width?: number, height?: number) {
    super(width, height)
    loading.add(this)
    const done = () => loading.delete(this)
    this.addEventListener("load", done, { once: true })
    this.addEventListener("error", done, { once: true })
  }
} as typeof window.Image

const wait = (ms: number) => new Promise((resolve) => timeout(resolve, ms))

async function imagesDone() {
  for (let elapsed = 0; elapsed < 5000; elapsed += 50) {
    for (const image of loading) {
      if (!image.src || image.complete) loading.delete(image)
    }
    if (loading.size === 0) return
    await wait(50)
  }
}

async function timersDone() {
  for (let elapsed = 0; pending.size > 0 && elapsed < 2000; elapsed += 50) {
    await wait(50)
  }
}

function backgroundImages() {
  const urls = new Set<string>()
  for (const element of document.body.querySelectorAll("*")) {
    for (const [, url] of getComputedStyle(element).backgroundImage.matchAll(
      /url\("?(.+?)"?\)/g
    )) {
      if (url) urls.add(url)
    }
  }
  return Array.from(urls, (url) => {
    const image = new Image()
    image.src = url
    return image.decode().catch(() => undefined)
  })
}

export function transitionsDone() {
  return Promise.race([Promise.all(runningTransitions()), wait(1000)])
}

function runningTransitions() {
  return document
    .getAnimations()
    .filter(
      (animation) =>
        animation.playState === "running" &&
        Number.isFinite(animation.effect?.getComputedTiming().endTime)
    )
    .map((animation) => animation.finished.catch(() => undefined))
}

export async function settle() {
  await imagesDone()
  await Promise.race([
    Promise.all([
      document.fonts.ready,
      ...Array.from(document.images, (image) =>
        image.decode().catch(() => undefined)
      ),
      ...backgroundImages(),
    ]),
    wait(5000),
  ])
  await timersDone()
  await Promise.race([Promise.all(runningTransitions()), wait(4000)])
  const quiet = document.querySelector(".recharts-wrapper") ? 600 : 150
  let previous = ""
  for (let attempt = 0; attempt < 20; attempt++) {
    await frames(2)
    await Promise.race([Promise.all(runningTransitions()), wait(4000)])
    const current = document.body.innerHTML
    if (current === previous) return
    previous = current
    await wait(quiet)
  }
}

async function frames(count: number) {
  for (let frame = 0; frame < count; frame++) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
}
