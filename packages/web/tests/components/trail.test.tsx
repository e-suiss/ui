import type * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Trail, type TrailItem } from "@/components/patterns/trail"

afterEach(async () => {
  await page.viewport(1280, 800)
  window.history.replaceState(null, "", window.location.pathname)
})

const article: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Account", href: "#account" },
  { label: "Security", href: "#security" },
  { label: "Two-factor authentication" },
]

const deep: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Products", href: "#products" },
  { label: "Workspace", href: "#workspace" },
  { label: "Billing", href: "#billing" },
  { label: "Invoices", href: "#invoices" },
  { label: "Download an invoice" },
]

function RouterLink({
  href,
  onNavigate,
  ...props
}: React.ComponentProps<"a"> & { onNavigate: (href?: string) => void }) {
  return (
    <a
      href={href}
      data-router=""
      {...props}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(href)
      }}
    />
  )
}

function crumbs() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=breadcrumb-item]"),
    (item) => item.textContent
  )
}

function history() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=trail-history-item]"),
    (item) => [item.textContent, item.getAttribute("href")]
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const backLink = (name: string) => page.getByRole("link", { name })
const menu = () => page.getByRole("menu")

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

function touch(type: string, offset = 0) {
  const target = element("trail-back")
  const rect = target.getBoundingClientRect()
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: rect.left + rect.width / 2 + offset,
      clientY: rect.top + rect.height / 2,
      bubbles: true,
      cancelable: true,
    })
  )
}

describe("Trail on desktop", () => {
  it("renders every level as a breadcrumb ending on the current page", async () => {
    await render(<Trail items={article} />)
    await expect
      .element(page.getByRole("navigation", { name: "breadcrumb" }))
      .toBeVisible()
    expect(crumbs()).toEqual([
      "Support",
      "Account",
      "Security",
      "Two-factor authentication",
    ])
    await expect
      .element(page.getByRole("link", { name: "Account" }))
      .toHaveAttribute("href", "#account")
    await expect
      .element(page.getByText("Two-factor authentication"))
      .toHaveAttribute("aria-current", "page")
    await expect
      .element(page.getByRole("link", { name: "Two-factor authentication" }))
      .not.toBeInTheDocument()
  })

  it("navigates with a breadcrumb link", async () => {
    await render(<Trail items={article} />)
    await page.getByRole("link", { name: "Security" }).click()
    expect(window.location.hash).toBe("#security")
  })

  it("collapses the middle levels behind an ellipsis", async () => {
    await render(<Trail items={deep} maxItems={4} />)
    expect(crumbs()).toEqual([
      "Support",
      "More",
      "Billing",
      "Invoices",
      "Download an invoice",
    ])
    await expect
      .element(page.getByRole("link", { name: "Products" }))
      .not.toBeInTheDocument()
    await expect
      .element(element("breadcrumb-ellipsis").querySelector("svg"))
      .toBeVisible()
  })

  it.each([
    [2, ["Support", "More", "Download an invoice"]],
    [3, ["Support", "More", "Invoices", "Download an invoice"]],
    [
      6,
      [
        "Support",
        "Products",
        "Workspace",
        "Billing",
        "Invoices",
        "Download an invoice",
      ],
    ],
  ])("shows at most %i levels", async (maxItems, expected) => {
    await render(<Trail items={deep} maxItems={maxItems} />)
    expect(crumbs()).toEqual(expected)
  })

  it("uses a custom ellipsis label", async () => {
    await render(<Trail items={deep} maxItems={3} ellipsisLabel="Hidden" />)
    expect(crumbs()).toContain("Hidden")
  })

  it("renders links through a custom element", async () => {
    const onNavigate = vi.fn()
    await render(
      <Trail items={article} render={<RouterLink onNavigate={onNavigate} />} />
    )
    await expect
      .element(page.getByRole("link", { name: "Account" }))
      .toHaveAttribute("data-router", "")
    await page.getByRole("link", { name: "Account" }).click()
    expect(onNavigate).toHaveBeenCalledWith("#account")
    expect(window.location.hash).toBe("")
  })
})

describe("Trail on mobile", () => {
  it("shows a single back link to the parent", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    await expect
      .element(page.getByRole("navigation", { name: "Back" }))
      .toBeVisible()
    await expect
      .element(backLink("Security"))
      .toHaveAttribute("href", "#security")
    expect(page.getByRole("link").elements()).toHaveLength(1)
    expect(document.querySelector("[data-slot=breadcrumb]")).toBeNull()
  })

  it("uses a custom back label", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} backLabel="Back" />)
    await expect.element(backLink("Back")).toHaveAttribute("href", "#security")
  })

  it("renders nothing at the top level", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={[{ label: "Support" }]} />)
    expect(document.querySelector("[data-slot=trail]")).toBeNull()
  })

  it("has no history menu with a single ancestor", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article.slice(2)} />)
    await expect
      .element(backLink("Security"))
      .not.toHaveAttribute("aria-haspopup")
    await backLink("Security").click({ button: "right" })
    await wait(200)
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("navigates to the parent on a click", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    await backLink("Security").click()
    expect(window.location.hash).toBe("#security")
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("opens the history on right click with the nearest ancestor first", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    await expect
      .element(backLink("Security"))
      .toHaveAttribute("aria-haspopup", "menu")
    await expect
      .element(backLink("Security"))
      .toHaveAttribute("aria-expanded", "false")
    await backLink("Security").click({ button: "right" })
    await expect.element(menu()).toBeVisible()
    await expect
      .element(backLink("Security").first())
      .toHaveAttribute("aria-expanded", "true")
    expect(history()).toEqual([
      ["Security", "#security"],
      ["Account", "#account"],
      ["Support", "#support"],
    ])
  })

  it("navigates from the history and closes it", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    await backLink("Security").click({ button: "right" })
    await menu().getByRole("menuitem", { name: "Support" }).click()
    expect(window.location.hash).toBe("#support")
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it.each([
    ["the context menu key", "{ContextMenu}"],
    ["Shift+F10", "{Shift>}{F10}{/Shift}"],
  ])("opens the history with %s and closes it with Escape", async (_, keys) => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    element("trail-back").focus()
    await userEvent.keyboard(keys)
    await expect.element(menu()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()
    expect(window.location.hash).toBe("")
  })

  it("opens the history on a long press without following the link", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    touch("pointerdown")
    await wait(200)
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(menu()).toBeVisible()
    touch("pointerup")
    element("trail-back").click()
    await wait(100)
    expect(window.location.hash).toBe("")
    await expect.element(menu()).toBeVisible()
  })

  it("follows the link after a short tap", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    touch("pointerdown")
    await wait(100)
    touch("pointerup")
    element("trail-back").click()
    expect(window.location.hash).toBe("#security")
    await wait(600)
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("cancels the long press when the finger moves away", async () => {
    await page.viewport(390, 844)
    await render(<Trail items={article} />)
    touch("pointerdown")
    touch("pointermove", 30)
    await wait(700)
    await expect.element(menu()).not.toBeInTheDocument()
  })
})
