import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { NavLocal } from "@/components/blocks/nav-local"

afterEach(async () => {
  window.scrollTo(0, 0)
  window.history.replaceState(null, "", window.location.pathname)
  await page.viewport(1280, 800)
})

function Page() {
  return (
    <div style={{ paddingBottom: "100vh" }}>
      <NavLocal />
    </div>
  )
}

const link = (name: string) => page.getByRole("link", { name, exact: true })
const header = () => {
  const node = document.querySelector<HTMLElement>("[data-slot=navbar]")
  if (!node) throw new Error("navbar not rendered")
  return node
}

function current() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[aria-current=page]"),
    (node) => node.textContent
  )
}

function centre(id: string) {
  const section = document.getElementById(id)
  if (!section) throw new Error(`${id} not rendered`)
  const rect = section.getBoundingClientRect()
  window.scrollTo(
    0,
    window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2
  )
}

describe("NavLocal", () => {
  it("highlights the overview at the top of the page", async () => {
    await render(<Page />)
    await expect
      .element(link("Overview"))
      .toHaveAttribute("aria-current", "page")
    expect(current()).toEqual(["Overview"])
    expect(header().hasAttribute("data-scrolled")).toBe(false)
    await expect
      .element(page.getByRole("button", { name: "Buy" }))
      .toBeVisible()
  })

  it.each([
    ["why", "Why suiss"],
    ["specs", "Tech Specs"],
  ])(
    "highlights %s when it reaches the middle of the screen",
    async (id, label) => {
      await render(<Page />)
      await expect.poll(current).toEqual(["Overview"])
      centre(id)
      await expect.poll(current).toEqual([label])
      await expect.element(link(label)).toHaveAttribute("aria-current", "page")
      await expect.element(link("Overview")).not.toHaveAttribute("aria-current")
    }
  )

  it("follows the sections back up the page", async () => {
    await render(<Page />)
    centre("specs")
    await expect.poll(current).toEqual(["Tech Specs"])
    centre("why")
    await expect.poll(current).toEqual(["Why suiss"])
  })

  it("frosts the bar once the page scrolls", async () => {
    await render(<Page />)
    await expect.element(link("Overview")).toBeVisible()
    window.scrollTo(0, 4)
    await new Promise(requestAnimationFrame)
    expect(header().hasAttribute("data-scrolled")).toBe(false)
    window.scrollTo(0, 40)
    await expect.poll(() => header().hasAttribute("data-scrolled")).toBe(true)
    window.scrollTo(0, 0)
    await expect.poll(() => header().hasAttribute("data-scrolled")).toBe(false)
  })

  it("jumps to a section from the bar", async () => {
    await render(<Page />)
    await link("Tech Specs").click()
    await expect.poll(() => window.location.hash).toBe("#specs")
    await expect.poll(() => window.scrollY).toBeGreaterThan(0)
  })

  it("moves the sections into a menu on a phone", async () => {
    await page.viewport(390, 844)
    await render(<Page />)
    await expect.element(link("Overview")).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", { name: "Buy" }))
      .toBeVisible()
    await page.getByRole("button", { name: "Menu" }).click()
    await expect.element(link("Overview")).toBeVisible()
    await expect
      .element(link("Overview"))
      .toHaveAttribute("aria-current", "page")
    await expect.element(link("Tech Specs")).not.toHaveAttribute("aria-current")
  })
})
