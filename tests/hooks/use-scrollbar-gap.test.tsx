import type * as React from "react"
import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const SCROLLBAR = 15

const html = document.documentElement
const body = document.body

function fakeScrollbar() {
  const gutter = () =>
    html.style.getPropertyValue("scrollbar-gutter") === "auto" ? 0 : SCROLLBAR
  const measure = html.getBoundingClientRect.bind(html)
  Object.defineProperty(html, "clientWidth", {
    configurable: true,
    get: () => window.innerWidth - (html.style.scrollbarGutter ? 0 : gutter()),
  })
  html.getBoundingClientRect = () => {
    const rect = measure()
    return new DOMRect(
      rect.x,
      rect.y,
      window.innerWidth - gutter(),
      rect.height
    )
  }
}

afterEach(() => {
  Reflect.deleteProperty(html, "clientWidth")
  Reflect.deleteProperty(html, "getBoundingClientRect")
})

const dialog = (
  <Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogTitle>Title</DialogTitle>
    </DialogContent>
  </Dialog>
)

const drawer = (
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerTitle>Title</DrawerTitle>
    </DrawerContent>
  </Drawer>
)

async function open(element: React.ReactElement) {
  await render(element)
  await userEvent.click(page.getByRole("button", { name: "Open" }))
  await expect.poll(() => body.style.overflow).toBe("hidden")
}

async function close() {
  await userEvent.keyboard("{Escape}")
  await expect.poll(() => body.style.overflow).toBe("")
}

describe("useScrollbarGap", () => {
  it.each([
    ["dialog", dialog],
    ["drawer", drawer],
  ])(
    "swaps the scrollbar gutter for padding while a %s is open",
    async (_name, element) => {
      fakeScrollbar()
      await open(element)
      await expect
        .poll(() => html.style.getPropertyValue("scrollbar-gutter"))
        .toBe("auto")
      expect(html.style.getPropertyPriority("scrollbar-gutter")).toBe(
        "important"
      )
      expect(body.style.paddingInlineEnd).toBe(`${SCROLLBAR}px`)
      await close()
      expect(body.style.paddingInlineEnd).toBe("")
      expect(html.style.getPropertyValue("scrollbar-gutter")).toBe("")
    }
  )

  it("keeps padding that the page set itself", async () => {
    fakeScrollbar()
    body.style.paddingInlineEnd = "4px"
    await open(dialog)
    await expect.poll(() => body.style.paddingInlineEnd).toBe(`${SCROLLBAR}px`)
    await close()
    expect(body.style.paddingInlineEnd).toBe("4px")
    body.style.paddingInlineEnd = ""
  })

  it("leaves the page alone without a visible scrollbar", async () => {
    await open(dialog)
    expect(body.style.paddingInlineEnd).toBe("")
    expect(html.style.getPropertyValue("scrollbar-gutter")).not.toBe("auto")
    await close()
  })
})
