import { afterEach, beforeEach, expect, vi } from "vitest"
import { page } from "vitest/browser"

vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true })
vi.setSystemTime(new Date(2026, 0, 15, 9, 41))

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

async function settle() {
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
  await Promise.race([Promise.all(runningTransitions()), wait(2000)])
  const quiet = document.querySelector(".recharts-wrapper") ? 600 : 150
  let previous = ""
  for (let attempt = 0; attempt < 20; attempt++) {
    const current = document.body.innerHTML
    if (current === previous) return
    previous = current
    await wait(quiet)
  }
}

beforeEach(() => {
  vi.setSystemTime(new Date(2026, 0, 15, 9, 41))
  document.body.style.padding = "1rem"
})

afterEach(async ({ task }) => {
  if (task.result?.state === "fail") return
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  try {
    for (const theme of ["light", "dark"] as const) {
      root.classList.toggle("dark", theme === "dark")
      await settle()
      await expect(page).toMatchScreenshot(`${task.name}-${theme}`, {
        screenshotOptions: {
          mask: Array.from(
            document.querySelectorAll("[data-visual-mask]"),
            (element) => page.elementLocator(element)
          ),
        },
      })
    }
  } finally {
    root.classList.toggle("dark", wasDark)
  }
})
