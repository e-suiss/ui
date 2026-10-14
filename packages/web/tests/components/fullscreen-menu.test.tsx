import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  FullscreenMenu,
  FullscreenMenuClose,
  FullscreenMenuContent,
  FullscreenMenuGroup,
  FullscreenMenuLabel,
  FullscreenMenuLink,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
} from "@/components/ui/fullscreen-menu"

const PRIMARY = ["Store", "Products", "Services"]

type MenuProps = React.ComponentProps<typeof FullscreenMenu> & {
  closeLabel?: string
  showCloseButton?: boolean
  onNavigate?: (link: string) => void
}

const trigger = () => page.getByRole("button", { name: "Menu" })
const menu = () => page.getByRole("dialog", { name: "Site menu" })
const link = (name: string) => page.getByRole("link", { name })
const close = () => page.getByRole("button", { name: "Close", exact: true })

function content() {
  const node = document.querySelector<HTMLElement>(
    "[data-slot=fullscreen-menu-content]"
  )
  if (!node) throw new Error("menu content not rendered")
  return node
}

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

async function settled() {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const current = getComputedStyle(content()).clipPath
    still = current === last ? still + 1 : 0
    last = current
  }
  return last
}

function Menu({
  closeLabel,
  showCloseButton,
  onNavigate,
  ...props
}: MenuProps) {
  const [active, setActive] = React.useState("Store")
  return (
    <div className="flex h-14 items-center justify-between px-4">
      <span>Acme</span>
      <FullscreenMenu {...props}>
        <FullscreenMenuTrigger aria-label="Menu" />
        <FullscreenMenuContent
          closeLabel={closeLabel}
          showCloseButton={showCloseButton}
        >
          <FullscreenMenuTitle>Site menu</FullscreenMenuTitle>
          <FullscreenMenuGroup>
            {PRIMARY.map((item) => (
              <FullscreenMenuLink
                key={item}
                href={`#${item.toLowerCase()}`}
                isActive={active === item}
                onClick={() => {
                  setActive(item)
                  onNavigate?.(item)
                }}
              >
                {item}
              </FullscreenMenuLink>
            ))}
          </FullscreenMenuGroup>
          <FullscreenMenuGroup>
            <FullscreenMenuLabel>Shop</FullscreenMenuLabel>
            <FullscreenMenuLink href="#find-a-store">
              Find a store
            </FullscreenMenuLink>
            <FullscreenMenuLink render={<button type="button" />}>
              Order status
            </FullscreenMenuLink>
          </FullscreenMenuGroup>
          {showCloseButton === false && (
            <FullscreenMenuClose>Dismiss</FullscreenMenuClose>
          )}
        </FullscreenMenuContent>
      </FullscreenMenu>
    </div>
  )
}

function Controlled({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <output>{open ? "open" : "closed"}</output>
      <button type="button" onClick={() => setOpen(true)}>
        Open from outside
      </button>
      <Menu
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange(next)
        }}
      />
    </>
  )
}

async function openMenu() {
  await trigger().click()
  await expect.element(menu()).toBeVisible()
  await settled()
}

afterEach(async () => {
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  )
  await page.viewport(1280, 800)
})

describe("FullscreenMenu opening and closing", () => {
  it("opens from the trigger as a titled dialog covering the screen", async () => {
    await render(<Menu />)
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
    const button = trigger().element()
    await openMenu()
    expect(button.getAttribute("aria-expanded")).toBe("true")
    expect(button.hasAttribute("data-popup-open")).toBe(true)
    const rect = content().getBoundingClientRect()
    expect([rect.left, rect.top, rect.width, rect.height]).toEqual([
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    ])
    expect(await settled()).toBe("inset(0px)")
  })

  it("reveals from the top down", async () => {
    await render(<Menu />)
    await trigger().click()
    await expect.element(menu()).toBeInTheDocument()
    const start = getComputedStyle(content()).clipPath
    expect(start).not.toBe("inset(0px)")
    expect(await settled()).toBe("inset(0px)")
  })

  it("closes with the close button and returns focus to the trigger", async () => {
    await render(<Menu />)
    await openMenu()
    await close().click()
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  it("closes with Escape and returns focus to the trigger", async () => {
    await render(<Menu />)
    await openMenu()
    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("keeps keyboard focus inside while open", async () => {
    await render(<Menu />)
    await openMenu()
    for (let step = 0; step < 8; step++) {
      await userEvent.tab()
      expect(content().contains(document.activeElement)).toBe(true)
    }
  })

  it("starts open with defaultOpen", async () => {
    await render(<Menu defaultOpen />)
    await expect.element(menu()).toBeVisible()
    await close().click()
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    await render(<Controlled onOpenChange={onOpenChange} />)
    await page.getByRole("button", { name: "Open from outside" }).click()
    await expect.element(menu()).toBeVisible()
    expect(onOpenChange).not.toHaveBeenCalled()
    await settled()
    await link("Products").click()
    await expect.element(menu()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await expect.element(page.getByRole("status")).toHaveTextContent("closed")
  })

  it("stays open when a controlled parent ignores the change", async () => {
    const onOpenChange = vi.fn()
    await render(<Menu open onOpenChange={onOpenChange} />)
    await expect.element(menu()).toBeVisible()
    await settled()
    await close().click()
    await userEvent.keyboard("{Escape}")
    await wait(400)
    await expect.element(menu()).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe("FullscreenMenu links", () => {
  it("marks the active link as the current page", async () => {
    await render(<Menu />)
    await openMenu()
    await expect.element(link("Store")).toHaveAttribute("aria-current", "page")
    await expect.element(link("Store")).toHaveAttribute("data-active")
    await expect.element(link("Products")).not.toHaveAttribute("aria-current")
  })

  it("closes the menu when a link is followed and keeps its own click", async () => {
    const onNavigate = vi.fn()
    await render(<Menu onNavigate={onNavigate} />)
    await openMenu()
    await link("Services").click()
    expect(onNavigate).toHaveBeenCalledWith("Services")
    await expect.element(menu()).not.toBeInTheDocument()
    expect(window.location.hash).toBe("#services")
    await openMenu()
    await expect
      .element(link("Services"))
      .toHaveAttribute("aria-current", "page")
    await expect.element(link("Store")).not.toHaveAttribute("aria-current")
  })

  it("closes the menu from a link rendered as another element", async () => {
    await render(<Menu />)
    await openMenu()
    await page.getByRole("button", { name: "Order status" }).click()
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("shows grouped links smaller under their label", async () => {
    await render(<Menu />)
    await openMenu()
    await expect.element(page.getByText("Shop", { exact: true })).toBeVisible()
    const primary = getComputedStyle(link("Store").element()).fontSize
    const grouped = getComputedStyle(link("Find a store").element()).fontSize
    expect(Number.parseFloat(grouped)).toBeLessThan(Number.parseFloat(primary))
  })

  it("staggers the links into view", async () => {
    await render(<Menu />)
    await openMenu()
    const delays = ["Store", "Products", "Services"].map((name) =>
      Number.parseFloat(getComputedStyle(link(name).element()).transitionDelay)
    )
    expect(delays[0]).toBeLessThan(delays[1] ?? 0)
    expect(delays[1]).toBeLessThan(delays[2] ?? 0)
    const later = Number.parseFloat(
      getComputedStyle(link("Find a store").element()).transitionDelay
    )
    expect(later).toBeGreaterThan(delays[0] ?? 0)
    await expect
      .poll(() => getComputedStyle(link("Services").element()).opacity)
      .toBe("1")
  })
})

describe("FullscreenMenu close button", () => {
  it("uses a text close button when a label is given", async () => {
    await render(<Menu closeLabel="Done" />)
    await openMenu()
    await expect.element(close()).not.toBeInTheDocument()
    await page.getByRole("button", { name: "Done" }).click()
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("can drop the built-in close button for a custom one", async () => {
    await render(<Menu showCloseButton={false} />)
    await openMenu()
    await expect.element(close()).not.toBeInTheDocument()
    await page.getByRole("button", { name: "Dismiss" }).click()
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("keeps the close button pinned while the menu scrolls", async () => {
    await page.viewport(390, 300)
    await render(<Menu />)
    await openMenu()
    const before = close().element().getBoundingClientRect().top
    content().scrollTop = 200
    await frame()
    expect(content().scrollTop).toBeGreaterThan(0)
    expect(close().element().getBoundingClientRect().top).toBe(before)
  })
})
