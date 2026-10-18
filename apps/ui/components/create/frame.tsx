"use client"

import * as React from "react"
import { CreatePreview } from "@/components/create/preview"
import { PreviewIconsProvider } from "@/components/site/icon-placeholder"
import { showStyle } from "@/components/site/style-sheet"
import type { IconLibrary } from "@/lib/code-options"
import {
  type CreateState,
  DEFAULT_STATE,
  fontOf,
  themeVariables,
} from "@/lib/create/options"

export const FRAME_MESSAGE = "suiss:create"
export const FRAME_HEIGHT = "suiss:create-height"

export type FrameMessage = {
  type: typeof FRAME_MESSAGE
  state: CreateState
  dark: boolean
}

const THEME_STYLE = "create-theme"
const FONT_LINK = "create-font"
const MENU_ROOM = 220

function declarations(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")
}

function applyTheme(state: CreateState) {
  const { light, dark } = themeVariables(state)
  const font = fontOf(state.font)
  let element = document.getElementById(THEME_STYLE)
  if (!element) {
    element = document.createElement("style")
    element.id = THEME_STYLE
    document.head.append(element)
  }
  element.textContent = [
    `html:root{${declarations(light)}${font ? `--font-sans:'${font.google}',sans-serif;` : ""}}`,
    `html.dark:root{${declarations(dark)}}`,
    font ? "html body{font-family:var(--font-sans)}" : "",
  ].join("")
  if (font) {
    let link = document.getElementById(FONT_LINK) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.id = FONT_LINK
      link.rel = "stylesheet"
      document.head.append(link)
    }
    link.href = `https://fonts.googleapis.com/css2?family=${font.google.replace(/ /g, "+")}:wght@400..700&display=swap`
  }
  const root = document.documentElement
  if (state.menuColor.endsWith("translucent")) {
    root.dataset.menuTranslucent = ""
  } else {
    delete root.dataset.menuTranslucent
  }
}

export function CreateFrame() {
  const [state, setState] = React.useState<CreateState>(DEFAULT_STATE)
  const content = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onMessage = (event: MessageEvent<FrameMessage>) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== window.parent) return
      if (event.data?.type !== FRAME_MESSAGE) return
      setState(event.data.state)
      document.documentElement.classList.toggle("dark", event.data.dark)
    }
    window.addEventListener("message", onMessage)
    window.parent.postMessage({ type: FRAME_MESSAGE }, window.location.origin)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  React.useEffect(() => {
    applyTheme(state)
    void showStyle(state.style)
  }, [state])

  React.useEffect(() => {
    const element = content.current
    if (!element) return
    const report = () =>
      window.parent.postMessage(
        {
          type: FRAME_HEIGHT,
          height: Math.ceil(element.getBoundingClientRect().height) + MENU_ROOM,
        },
        window.location.origin
      )
    const observer = new ResizeObserver(report)
    observer.observe(element)
    report()
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={content} className="bg-background p-2">
      <PreviewIconsProvider icons={state.iconLibrary as IconLibrary}>
        <CreatePreview />
      </PreviewIconsProvider>
    </div>
  )
}
