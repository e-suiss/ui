import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = [
  { value: "account", label: "Account", content: "Update your name." },
  {
    value: "notifications",
    label: "Notifications",
    content: "Choose updates.",
  },
  { value: "settings", label: "Settings", content: "Manage language." },
]

const MANY = [
  "General",
  "Account",
  "Notifications",
  "Privacy",
  "Appearance",
  "Language",
  "Billing",
]

type TabsProps = React.ComponentProps<typeof Tabs> & {
  variant?: "default" | "line"
  activateOnFocus?: boolean
  disabled?: string
}

const tab = (name: string) => page.getByRole("tab", { name, exact: true })
const panel = () => page.getByRole("tabpanel")

function slot(name: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${name}]`)
  if (!node) throw new Error(`${name} not rendered`)
  return node
}

const indicator = () => slot("tabs-indicator")
const list = () => slot("tabs-list")

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function settled(element: () => HTMLElement) {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const rect = element().getBoundingClientRect()
    const current = `${rect.left},${rect.top},${rect.width},${rect.height},${list().scrollLeft}`
    still = current === last ? still + 1 : 0
    last = current
  }
  return element().getBoundingClientRect()
}

function Example({ variant, activateOnFocus, disabled, ...props }: TabsProps) {
  return (
    <div className="w-96 p-4">
      <Tabs defaultValue="account" {...props}>
        <TabsList variant={variant} activateOnFocus={activateOnFocus}>
          {TABS.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              disabled={item.value === disabled}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function Many({ defaultValue = "General" }: { defaultValue?: string }) {
  return (
    <div className="w-80 px-6">
      <Tabs defaultValue={defaultValue}>
        <TabsList>
          {MANY.map((name) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        {MANY.map((name) => (
          <TabsContent key={name} value={name}>
            {name} settings
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function Controlled({
  onValueChange,
}: {
  onValueChange: (value: unknown) => void
}) {
  const [value, setValue] = React.useState("account")
  return (
    <>
      <button type="button" onClick={() => setValue("settings")}>
        Show settings
      </button>
      <Example
        value={value}
        onValueChange={(next) => {
          setValue(String(next))
          onValueChange(next)
        }}
      />
    </>
  )
}

function rect(element: Element) {
  const box = element.getBoundingClientRect()
  return [box.left, box.top, box.width, box.height].map(Math.round)
}

async function indicatorOn(name: string) {
  await expect
    .poll(async () => {
      await settled(indicator)
      const target = rect(tab(name).element())
      return rect(indicator()).map(
        (value, index) => value - (target[index] ?? 0)
      )
    })
    .toEqual([0, 0, 0, 0])
}

afterEach(async () => {
  vi.restoreAllMocks()
  await page.viewport(1280, 800)
})

describe("Tabs selection", () => {
  it("shows the default tab and its panel", async () => {
    await render(<Example />)
    await expect.element(page.getByRole("tablist")).toBeVisible()
    await expect
      .element(tab("Account"))
      .toHaveAttribute("aria-selected", "true")
    await expect
      .element(tab("Notifications"))
      .toHaveAttribute("aria-selected", "false")
    await expect.element(panel()).toHaveTextContent("Update your name.")
    await expect.element(panel()).toHaveAccessibleName("Account")
  })

  it("switches tab and panel on click", async () => {
    await render(<Example />)
    await tab("Settings").click()
    await expect
      .element(tab("Settings"))
      .toHaveAttribute("aria-selected", "true")
    await expect
      .element(tab("Account"))
      .toHaveAttribute("aria-selected", "false")
    await expect.element(panel()).toHaveTextContent("Manage language.")
    expect(page.getByRole("tabpanel").elements()).toHaveLength(1)
  })

  it("moves focus with the up and down arrows when vertical", async () => {
    await render(<Example orientation="vertical" />)
    await expect
      .element(page.getByRole("tablist"))
      .toHaveAttribute("aria-orientation", "vertical")
    await tab("Account").click()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(tab("Notifications")).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(tab("Notifications")).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(tab("Account")).toHaveFocus()
  })

  it("moves focus with the arrow keys and selects with Enter", async () => {
    await render(<Example />)
    await tab("Account").click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(tab("Notifications")).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(tab("Settings")).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(tab("Account")).toHaveFocus()
    await userEvent.keyboard("{End}")
    await expect.element(tab("Settings")).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect.element(tab("Account")).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(tab("Settings")).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(tab("Settings"))
      .toHaveAttribute("aria-selected", "true")
    await expect.element(panel()).toHaveTextContent("Manage language.")
  })

  it("selects on focus when asked", async () => {
    await render(<Example activateOnFocus />)
    await tab("Account").click()
    await userEvent.keyboard("{ArrowRight}")
    await expect
      .element(tab("Notifications"))
      .toHaveAttribute("aria-selected", "true")
    await expect.element(panel()).toHaveTextContent("Choose updates.")
  })

  it("is a single tab stop that leads into the panel", async () => {
    await render(
      <div>
        <button type="button">Before</button>
        <Example />
      </div>
    )
    page.getByRole("button", { name: "Before" }).element().focus()
    await userEvent.tab()
    await expect.element(tab("Account")).toHaveFocus()
    await userEvent.tab()
    await expect.element(panel()).toHaveFocus()
  })

  it("ignores a disabled tab from pointer and keyboard", async () => {
    await render(<Example disabled="notifications" />)
    await expect
      .element(tab("Notifications"))
      .toHaveAttribute("aria-disabled", "true")
    await tab("Notifications").click({ force: true })
    await expect
      .element(tab("Account"))
      .toHaveAttribute("aria-selected", "true")
    await tab("Account").click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(tab("Notifications")).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(tab("Account"))
      .toHaveAttribute("aria-selected", "true")
    await expect.element(panel()).toHaveTextContent("Update your name.")
  })

  it("follows a controlled value and reports changes", async () => {
    const onValueChange = vi.fn()
    await render(<Controlled onValueChange={onValueChange} />)
    await page.getByRole("button", { name: "Show settings" }).click()
    await expect
      .element(tab("Settings"))
      .toHaveAttribute("aria-selected", "true")
    expect(onValueChange).not.toHaveBeenCalled()
    await tab("Notifications").click()
    expect(onValueChange.mock.lastCall?.[0]).toBe("notifications")
    await expect.element(panel()).toHaveTextContent("Choose updates.")
  })

  it("stays on the controlled value when the parent ignores the change", async () => {
    await render(<Example value="account" />)
    await tab("Settings").click()
    await expect
      .element(tab("Account"))
      .toHaveAttribute("aria-selected", "true")
    await expect.element(panel()).toHaveTextContent("Update your name.")
  })
})

describe("Tabs indicator", () => {
  it("sits under the active tab and slides to the next one", async () => {
    await render(<Example />)
    await indicatorOn("Account")
    await tab("Settings").click()
    await expect
      .poll(() => indicator().getBoundingClientRect().left)
      .not.toBe(tab("Account").element().getBoundingClientRect().left)
    await indicatorOn("Settings")
  })

  it("animates the slide rather than jumping", async () => {
    await render(<Example />)
    await indicatorOn("Account")
    const from = indicator().getBoundingClientRect().left
    const to = tab("Settings").element().getBoundingClientRect().left
    await tab("Settings").click()
    await frame()
    await frame()
    const midway = indicator().getBoundingClientRect().left
    expect(midway).toBeGreaterThan(from)
    expect(midway).toBeLessThan(to)
  })

  it("draws a thin line under the active tab in the line variant", async () => {
    await render(<Example variant="line" />)
    await tab("Notifications").click()
    await expect
      .poll(async () => {
        await settled(indicator)
        const line = indicator().getBoundingClientRect()
        const active = tab("Notifications").element().getBoundingClientRect()
        return [
          Math.round(line.left),
          Math.round(line.width),
          line.height,
          line.top >= active.bottom,
        ]
      })
      .toEqual([
        Math.round(tab("Notifications").element().getBoundingClientRect().left),
        Math.round(
          tab("Notifications").element().getBoundingClientRect().width
        ),
        2,
        true,
      ])
  })

  it("stacks tabs and moves the indicator vertically", async () => {
    await render(<Example orientation="vertical" />)
    const first = tab("Account").element().getBoundingClientRect()
    const second = tab("Notifications").element().getBoundingClientRect()
    expect(second.top).toBeGreaterThan(first.top)
    expect(second.left).toBe(first.left)
    await tab("Notifications").click()
    await indicatorOn("Notifications")
  })

  it("draws the vertical line beside the active tab", async () => {
    await render(<Example orientation="vertical" variant="line" />)
    await tab("Settings").click()
    await expect
      .poll(async () => {
        await settled(indicator)
        const line = indicator().getBoundingClientRect()
        const active = tab("Settings").element().getBoundingClientRect()
        return [
          Math.round(line.top),
          Math.round(line.height),
          line.width,
          line.left >= active.right,
        ]
      })
      .toEqual([
        Math.round(tab("Settings").element().getBoundingClientRect().top),
        Math.round(tab("Settings").element().getBoundingClientRect().height),
        2,
        true,
      ])
  })
})

describe("Tabs overflow", () => {
  it("scrolls the selected tab into view as it changes", async () => {
    await render(<Many />)
    await settled(indicator)
    expect(list().scrollWidth).toBeGreaterThan(list().clientWidth)
    expect(list().scrollLeft).toBe(0)
    await tab("General").click()
    await userEvent.keyboard("{End}{Enter}")
    await expect
      .element(tab("Billing"))
      .toHaveAttribute("aria-selected", "true")
    await expect
      .poll(() => {
        const box = list().getBoundingClientRect()
        const active = tab("Billing").element().getBoundingClientRect()
        return active.right <= box.right + 1 && active.left >= box.left - 1
      })
      .toBe(true)
    expect(list().scrollLeft).toBeGreaterThan(0)
    await indicatorOn("Billing")
    await userEvent.keyboard("{Home}{Enter}")
    await expect.poll(() => list().scrollLeft).toBe(0)
  })

  it("starts scrolled to a default tab that is out of view", async () => {
    await render(<Many defaultValue="Billing" />)
    await expect.poll(() => list().scrollLeft).toBeGreaterThan(0)
    const box = list().getBoundingClientRect()
    const active = tab("Billing").element().getBoundingClientRect()
    expect(active.right).toBeLessThanOrEqual(box.right + 1)
  })

  it("bleeds to the screen edges on a phone", async () => {
    await page.viewport(390, 844)
    await render(
      <div className="px-6">
        <Many />
      </div>
    )
    await expect.poll(() => list().getBoundingClientRect().left).toBe(0)
    const first = tab("General").element().getBoundingClientRect()
    expect(first.left).toBeGreaterThan(24)
  })

  it("stays inside its column on desktop", async () => {
    await render(
      <div className="px-6">
        <Many />
      </div>
    )
    await settled(indicator)
    expect(list().getBoundingClientRect().left).toBeGreaterThanOrEqual(24)
  })
})
