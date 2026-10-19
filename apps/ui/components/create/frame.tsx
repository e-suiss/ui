"use client"

import * as React from "react"
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

export type FrameMessage = {
  type: typeof FRAME_MESSAGE
  state: CreateState
  dark: boolean
}

const THEME_STYLE = "create-theme"
const FONT_LINK = "create-font"

function declarations(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")
}

const MENU_TARGET = ".cn-menu-target"
const INVERTED = "dark"

const BOLD_ACCENT =
  "html[data-menu-accent=bold] .cn-menu-target{--accent:var(--primary)!important;--accent-foreground:var(--primary-foreground)!important}"

function fontFamilyOf(google: string) {
  return google.replace(/_/g, " ")
}

function fontUrl(google: string, dependency: string) {
  const family = fontFamilyOf(google).replace(/ /g, "+")
  const axis = dependency.startsWith("@fontsource-variable/")
    ? ":wght@400..700"
    : ""
  return `https://fonts.googleapis.com/css2?family=${family}${axis}&display=swap`
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
    `html:root{${declarations(light)}${font ? `--font-sans:'${fontFamilyOf(font.google)}',${font.family.split(",").at(-1)?.trim()};` : ""}}`,
    `html.dark:root,html ${MENU_TARGET}.${INVERTED}{${declarations(dark)}}`,
    font ? "html body{font-family:var(--font-sans)}" : "",
    BOLD_ACCENT,
  ].join("")
  if (font) {
    let link = document.getElementById(FONT_LINK) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement("link")
      link.id = FONT_LINK
      link.rel = "stylesheet"
      document.head.append(link)
    }
    link.href = fontUrl(font.google, font.dependency)
  }
  const root = document.documentElement
  root.dataset.menuAccent = state.menuAccent
  if (state.menuColor.endsWith("translucent")) {
    root.dataset.menuTranslucent = ""
  } else {
    delete root.dataset.menuTranslucent
  }
}

function invertMenus(inverted: boolean) {
  for (const menu of document.querySelectorAll(MENU_TARGET)) {
    if (menu.classList.contains(INVERTED) !== inverted) {
      menu.classList.toggle(INVERTED, inverted)
    }
  }
}

export function CreateFrame({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CreateState>(DEFAULT_STATE)

  React.useEffect(() => {
    const onMessage = (event: MessageEvent<FrameMessage>) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== window.parent) return
      if (event.data?.type !== FRAME_MESSAGE || !event.data.state) return
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

  const inverted = state.menuColor.startsWith("inverted")
  React.useEffect(() => {
    invertMenus(inverted)
    const observer = new MutationObserver(() => invertMenus(inverted))
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [inverted])

  return (
    <PreviewIconsProvider icons={state.iconLibrary as IconLibrary}>
      {children}
    </PreviewIconsProvider>
  )
}
