import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarLink,
  TabBarList,
  TabBarSection,
  TabBarSectionTitle,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

const FEW = ["Home", "Nominees", "Directory"]
const MANY = [
  "Home",
  "Nominees",
  "Directory",
  "Collections",
  "Market",
  "Academy",
  "Conferences",
]
const SECTIONS = [
  { title: "Awards", links: ["Winners", "Site of the Day"] },
  { title: "Inspiration", links: ["Elements", "Resources"] },
]

type BarProps = React.ComponentProps<typeof TabBar> & {
  items?: string[]
  withSections?: boolean
  onSelect?: (value: string) => void
}

const nav = () => page.getByRole("navigation", { name: "Main" })
const more = () => page.getByRole("button", { name: "More" })
const item = (name: string) => page.getByRole("button", { name, exact: true })
const link = (name: string) => page.getByRole("link", { name, exact: true })
const outside = () => page.getByRole("button", { name: "Outside" })

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot=${name}]`)
}

function bar() {
  const node = slot("tab-bar")
  if (!node) throw new Error("tab bar not rendered")
  return node
}

function list() {
  const node = slot("tab-bar-list")
  if (!node) throw new Error("tab bar list not rendered")
  return node
}

function trigger() {
  const node = slot("tab-bar-trigger")
  if (!node) throw new Error("tab bar trigger not rendered")
  return node
}

const visibleItems = () =>
  Array.from(
    list().querySelectorAll<HTMLElement>("[data-slot=tab-bar-item]"),
    (node) => (node.hasAttribute("data-overflow") ? "" : node.textContent)
  ).filter(Boolean)

const overflowItems = () =>
  Array.from(
    list().querySelectorAll<HTMLElement>("[data-overflow]"),
    (node) => node.textContent
  )

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

async function settled(element: () => HTMLElement) {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const rect = element().getBoundingClientRect()
    const current = `${rect.left},${rect.top},${rect.width},${rect.height}`
    still = current === last ? still + 1 : 0
    last = current
  }
  return element().getBoundingClientRect()
}

function Bar({
  items = FEW,
  withSections = true,
  onSelect,
  ...props
}: BarProps) {
  const [value, setValue] = React.useState("Home")
  const select = (next: string) => {
    setValue(next)
    onSelect?.(next)
  }
  return (
    <div className="min-h-svh">
      <button type="button">Outside</button>
      <TabBar aria-label="Main" {...props}>
        <TabBarList>
          {items.map((name) => (
            <TabBarItem
              key={name}
              isActive={value === name}
              onClick={() => select(name)}
            >
              {name}
            </TabBarItem>
          ))}
        </TabBarList>
        <TabBarContent>
          {withSections &&
            SECTIONS.map((section) => (
              <TabBarSection key={section.title}>
                <TabBarSectionTitle>{section.title}</TabBarSectionTitle>
                {section.links.map((name) => (
                  <TabBarLink
                    key={name}
                    href={`#${name.toLowerCase().replaceAll(" ", "-")}`}
                    isActive={value === name}
                    onClick={() => select(name)}
                  >
                    {name}
                  </TabBarLink>
                ))}
              </TabBarSection>
            ))}
        </TabBarContent>
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
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
      <button type="button" onClick={() => setOpen(true)}>
        Open from outside
      </button>
      <Bar
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange(next)
        }}
      />
    </>
  )
}

function reduceMotion() {
  const original = window.matchMedia.bind(window)
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) =>
    query.includes("prefers-reduced-motion")
      ? original("(min-width: 0px)")
      : original(query)
  )
}

async function openBar() {
  await more().click()
  await expect.element(link("Winners")).toBeVisible()
  await settled(() => slot("tab-bar-content") ?? bar())
}

afterEach(async () => {
  vi.restoreAllMocks()
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  )
  await page.viewport(1280, 800)
})

describe("TabBar items", () => {
  it("floats centred at the bottom of the screen", async () => {
    await render(<Bar />)
    const rect = await settled(bar)
    expect(Math.round(window.innerHeight - rect.bottom)).toBe(16)
    expect(Math.round(rect.left + rect.width / 2)).toBe(window.innerWidth / 2)
  })

  it("marks the active item as the current page and switches on click", async () => {
    const onSelect = vi.fn()
    await render(<Bar onSelect={onSelect} />)
    await expect.element(nav()).toBeVisible()
    await expect.element(item("Home")).toHaveAttribute("aria-current", "page")
    await expect.element(item("Home")).toHaveAttribute("data-active")
    await item("Nominees").click()
    expect(onSelect).toHaveBeenCalledWith("Nominees")
    await expect
      .element(item("Nominees"))
      .toHaveAttribute("aria-current", "page")
    await expect.element(item("Home")).not.toHaveAttribute("aria-current")
  })

  it("renders items as links when asked", async () => {
    await render(
      <TabBar aria-label="Main">
        <TabBarList>
          <TabBarItem isActive render={<a href="#home" />}>
            Home
          </TabBarItem>
          <TabBarItem render={<a href="#news" />}>News</TabBarItem>
        </TabBarList>
        <TabBarContent />
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    )
    await expect.element(link("Home")).toHaveAttribute("aria-current", "page")
    await expect.element(link("News")).toHaveAttribute("href", "#news")
    expect(link("News").element().hasAttribute("type")).toBe(false)
  })

  it("does not react to a disabled item", async () => {
    const onClick = vi.fn()
    await render(
      <TabBar aria-label="Main">
        <TabBarList>
          <TabBarItem isActive>Home</TabBarItem>
          <TabBarItem disabled onClick={onClick}>
            Directory
          </TabBarItem>
        </TabBarList>
        <TabBarContent />
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    )
    await expect.element(item("Directory")).toBeDisabled()
    await item("Directory").click({ force: true })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("hides an idle More button when everything fits and there are no sections", async () => {
    await render(<Bar withSections={false} />)
    await expect.element(item("Directory")).toBeVisible()
    await expect.element(more()).not.toBeInTheDocument()
    expect(trigger().hasAttribute("data-idle")).toBe(true)
    expect(trigger().getAttribute("tabindex")).toBe("-1")
    expect(getComputedStyle(trigger()).visibility).toBe("hidden")
    expect(visibleItems()).toEqual(FEW)
    expect(overflowItems()).toEqual([])
  })

  it("moves items that do not fit into the More menu", async () => {
    await page.viewport(390, 844)
    await render(<Bar items={MANY} withSections={false} />)
    await expect.element(more()).toBeVisible()
    await expect.poll(() => overflowItems().length).toBeGreaterThan(0)
    const shown = visibleItems()
    const hidden = overflowItems()
    expect([...shown, ...hidden]).toEqual(MANY)
    const rect = await settled(bar)
    expect(rect.width).toBe(390 - 32)
    for (const name of hidden) {
      const node = list().querySelector<HTMLElement>(
        `[data-overflow]:nth-child(${MANY.indexOf(name ?? "") + 1})`
      )
      expect(node?.getAttribute("aria-hidden")).toBe("true")
      expect(node?.tabIndex).toBe(-1)
    }
    for (const name of shown) {
      const box = item(name ?? "")
        .element()
        .getBoundingClientRect()
      expect(box.right).toBeLessThanOrEqual(
        trigger().getBoundingClientRect().left
      )
    }
    await more().click()
    const section = slot("tab-bar-section")
    const links = Array.from(
      section?.querySelectorAll<HTMLElement>("[data-slot=tab-bar-link]") ?? [],
      (node) => node.textContent
    )
    expect(links).toEqual(hidden)
  })

  it("selects an overflowed item from the menu and closes it", async () => {
    await page.viewport(390, 844)
    const onSelect = vi.fn()
    await render(<Bar items={MANY} withSections={false} onSelect={onSelect} />)
    await expect.element(more()).toBeVisible()
    await more().click()
    const last = MANY.at(-1) ?? ""
    const entry = page
      .getByRole("button", { name: last, exact: true })
      .filter({ hasText: last })
      .last()
    await expect.element(entry).toBeVisible()
    await entry.click()
    expect(onSelect).toHaveBeenCalledWith(last)
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.poll(() => slot("tab-bar-content")).toBeNull()
  })

  it("brings items back when the screen grows", async () => {
    await page.viewport(390, 844)
    await render(<Bar items={MANY} withSections={false} />)
    await expect.poll(() => overflowItems().length).toBeGreaterThan(0)
    await page.viewport(1280, 800)
    await expect.poll(overflowItems).toEqual([])
    await expect.poll(visibleItems).toEqual(MANY)
    await expect.element(more()).not.toBeInTheDocument()
  })
})

describe("TabBar menu", () => {
  it("opens the sections from More", async () => {
    await render(<Bar />)
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.element(link("Winners")).not.toBeInTheDocument()
    const closed = await settled(bar)
    await openBar()
    await expect.element(more()).toHaveAttribute("aria-expanded", "true")
    const content = slot("tab-bar-content")
    expect(more().element().getAttribute("aria-controls")).toBe(content?.id)
    await expect.element(page.getByText("Awards")).toBeVisible()
    await expect.element(page.getByText("Inspiration")).toBeVisible()
    expect(list().inert).toBe(true)
    await expect.element(item("Home")).not.toBeInTheDocument()
    const open = await settled(bar)
    expect(open.width).toBeCloseTo(closed.width, 0)
    expect(open.height).toBeGreaterThan(closed.height)
    expect(Math.round(open.bottom)).toBe(Math.round(closed.bottom))
  })

  it("closes again from More and unmounts after the animation", async () => {
    await render(<Bar />)
    await openBar()
    await more().click()
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    expect(slot("tab-bar-content")?.hasAttribute("data-closing")).toBe(true)
    await expect.poll(() => slot("tab-bar-content")).toBeNull()
    expect(list().inert).toBe(false)
    await expect.element(item("Home")).toBeVisible()
  })

  it("closes with Escape and returns focus to More", async () => {
    await render(<Bar />)
    await openBar()
    link("Winners").element().focus()
    await userEvent.keyboard("{Escape}")
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.element(more()).toHaveFocus()
  })

  it("closes on a pointer press outside", async () => {
    await render(<Bar />)
    await openBar()
    await outside().click()
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
  })

  it("stays open on a pointer press inside", async () => {
    await render(<Bar />)
    await openBar()
    await page.getByText("Awards").click()
    await wait(300)
    await expect.element(more()).toHaveAttribute("aria-expanded", "true")
  })

  it("closes when a link is followed and marks it current", async () => {
    const onSelect = vi.fn()
    await render(<Bar onSelect={onSelect} />)
    await openBar()
    await link("Elements").click()
    expect(onSelect).toHaveBeenCalledWith("Elements")
    expect(window.location.hash).toBe("#elements")
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.poll(() => slot("tab-bar-content")).toBeNull()
    await openBar()
    await expect
      .element(link("Elements"))
      .toHaveAttribute("aria-current", "page")
    await expect.element(item("Home")).not.toBeInTheDocument()
  })

  it("starts open with defaultOpen", async () => {
    await render(<Bar defaultOpen />)
    await expect.element(link("Winners")).toBeVisible()
    await expect.element(more()).toHaveAttribute("aria-expanded", "true")
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    await render(<Controlled onOpenChange={onOpenChange} />)
    await page.getByRole("button", { name: "Open from outside" }).click()
    await expect.element(link("Winners")).toBeVisible()
    expect(onOpenChange).not.toHaveBeenCalled()
    await userEvent.keyboard("{Escape}")
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
  })

  it("stays open when a controlled parent ignores the change", async () => {
    const onOpenChange = vi.fn()
    await render(<Bar open onOpenChange={onOpenChange} />)
    await expect.element(link("Winners")).toBeVisible()
    await more().click()
    await wait(500)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await expect.element(link("Winners")).toBeVisible()
  })

  it("lets a trigger click handler cancel the toggle", async () => {
    await render(
      <TabBar aria-label="Main">
        <TabBarList>
          <TabBarItem isActive>Home</TabBarItem>
        </TabBarList>
        <TabBarContent>
          <TabBarSection>
            <TabBarLink href="#a">Winners</TabBarLink>
          </TabBarSection>
        </TabBarContent>
        <TabBarTrigger onClick={(event) => event.preventDefault()}>
          More
        </TabBarTrigger>
      </TabBar>
    )
    await more().click()
    await wait(200)
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.element(link("Winners")).not.toBeInTheDocument()
  })

  it("unmounts at once when reduced motion is preferred", async () => {
    reduceMotion()
    await render(<Bar />)
    await more().click()
    await expect.element(link("Winners")).toBeVisible()
    await expect
      .poll(() => slot("tab-bar-content")?.hasAttribute("data-settled"))
      .toBe(true)
    await more().click()
    await expect.poll(() => slot("tab-bar-content")).toBeNull()
  })

  it("makes the open menu scrollable once it has settled", async () => {
    await render(<Bar />)
    await more().click()
    await expect
      .poll(() => slot("tab-bar-content")?.hasAttribute("data-settled"))
      .toBe(true)
    const content = slot("tab-bar-content")
    expect(content ? getComputedStyle(content).overflowY : "").toBe("auto")
  })
})
