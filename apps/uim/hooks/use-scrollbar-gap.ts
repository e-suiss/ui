import * as React from "react"

let observer: MutationObserver | null = null
let applied: { padding: string } | null = null
let measured = 0

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
    body.style.paddingInlineEnd = applied.padding
    applied = null
  } else if (!locked) {
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
