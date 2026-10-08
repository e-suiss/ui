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
