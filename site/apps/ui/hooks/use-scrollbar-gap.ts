import * as React from "react"

let observer: MutationObserver | null = null
let applied: { padding: string } | null = null
let measured = 0
let releasing = false

function settled() {
  const running = document
    .getAnimations()
    .filter(
      (animation) =>
        animation.playState === "running" &&
        animation.effect?.getComputedTiming().endTime !==
          Number.POSITIVE_INFINITY
    )
    .map((animation) => animation.finished.catch(() => undefined))
  return Promise.race([
    Promise.all(running),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ])
}

function release(html: HTMLElement, body: HTMLElement) {
  if (releasing || !applied) return
  releasing = true
  const previous = html.style.overflow
  html.style.overflow = "hidden"
  requestAnimationFrame(() => {
    settled().then(() => {
      html.style.overflow = previous
      releasing = false
      if (isLocked(html, body) || !applied) return
      body.style.paddingInlineEnd = applied.padding
      applied = null
    })
  })
}

function isLocked(html: HTMLElement, body: HTMLElement) {
  return body.style.overflow === "hidden" && html.style.scrollbarGutter !== ""
}

function measure() {
  const html = document.documentElement
  if (isLocked(html, document.body)) return
  measured = Math.max(0, window.innerWidth - html.clientWidth)
}

function sync() {
  const html = document.documentElement
  const body = document.body
  const locked = isLocked(html, body)

  if (locked && !applied) {
    const width =
      measured ||
      Math.round(window.innerWidth - html.getBoundingClientRect().width)
    if (width <= 0) return
    applied = { padding: body.style.paddingInlineEnd }
    html.style.setProperty("scrollbar-gutter", "auto", "important")
    body.style.paddingInlineEnd = `${width}px`
  } else if (!locked && applied) {
    release(html, body)
  } else if (!locked && !releasing) {
    measure()
  }
}

function watch() {
  if (observer || typeof MutationObserver === "undefined") return
  observer = new MutationObserver(sync)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  })
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  })
  window.addEventListener("resize", measure)
}

export function useScrollbarGap() {
  React.useLayoutEffect(() => {
    measure()
    watch()
    sync()
  }, [])
}
