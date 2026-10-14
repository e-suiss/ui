import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type GroupProps = React.ComponentProps<typeof ToggleGroup>

const VIEWS = ["Day", "Week", "Month", "Year"]

const item = (name: string) => page.getByRole("button", { name, exact: true })

function slot(name: string) {
  return document.querySelector<HTMLElement>(`[data-slot=${name}]`)
}

function group() {
  const node = slot("toggle-group")
  if (!node) throw new Error("toggle group not rendered")
  return node
}

const pressed = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[aria-pressed=true]"),
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

function indicator() {
  const node = slot("toggle-group-indicator")
  if (!node) throw new Error("indicator not rendered")
  return node
}

const shown = (node: HTMLElement | null) =>
  node ? getComputedStyle(node).display !== "none" : false

function box(element: Element) {
  const rect = element.getBoundingClientRect()
  return [rect.left, rect.top, rect.width, rect.height].map(Math.round)
}

async function indicatorOn(name: string) {
  await expect
    .poll(async () => {
      await settled(indicator)
      const target = box(item(name).element())
      return box(indicator()).map(
        (value, index) => value - (target[index] ?? 0)
      )
    })
    .toEqual([0, 0, 0, 0])
}

function Views(props: GroupProps) {
  return (
    <ToggleGroup aria-label="Calendar view" {...props}>
      {VIEWS.map((view) => (
        <ToggleGroupItem key={view} value={view.toLowerCase()}>
          {view}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function Renaming() {
  const [long, setLong] = React.useState(false)
  return (
    <>
      <button type="button" onClick={() => setLong(true)}>
        Rename
      </button>
      <ToggleGroup spacing={0} defaultValue={["year"]}>
        <ToggleGroupItem value="day">
          {long ? "Today and tomorrow" : "Day"}
        </ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}

function Controlled({
  onValueChange,
}: {
  onValueChange: (value: string[]) => void
}) {
  const [value, setValue] = React.useState(["week"])
  return (
    <>
      <button type="button" onClick={() => setValue(["year"])}>
        Jump to year
      </button>
      <Views
        spacing={0}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onValueChange(next)
        }}
      />
    </>
  )
}

describe("ToggleGroup selection", () => {
  it("presses several items independently when multiple", async () => {
    const onValueChange = vi.fn()
    await render(
      <Views multiple defaultValue={["day"]} onValueChange={onValueChange} />
    )
    await expect.element(group()).toHaveAttribute("role", "group")
    await expect.element(item("Day")).toHaveAttribute("aria-pressed", "true")
    await item("Month").click()
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["day", "month"])
    expect(pressed()).toEqual(["Day", "Month"])
    await item("Day").click()
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["month"])
    expect(pressed()).toEqual(["Month"])
  })

  it("keeps a single pressed item when not multiple", async () => {
    const onValueChange = vi.fn()
    await render(
      <Views defaultValue={["week"]} onValueChange={onValueChange} />
    )
    await item("Year").click()
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["year"])
    expect(pressed()).toEqual(["Year"])
    await item("Year").click()
    expect(pressed()).toEqual([])
  })

  it("follows a controlled value", async () => {
    const onValueChange = vi.fn()
    await render(<Controlled onValueChange={onValueChange} />)
    await page.getByRole("button", { name: "Jump to year" }).click()
    expect(pressed()).toEqual(["Year"])
    expect(onValueChange).not.toHaveBeenCalled()
    await item("Day").click()
    expect(onValueChange.mock.lastCall?.[0]).toEqual(["day"])
    expect(pressed()).toEqual(["Day"])
  })

  it("stays on the controlled value when the parent ignores the change", async () => {
    await render(<Views value={["week"]} />)
    await item("Day").click()
    expect(pressed()).toEqual(["Week"])
  })

  it("disables every item with the group", async () => {
    const onValueChange = vi.fn()
    await render(
      <Views disabled defaultValue={["week"]} onValueChange={onValueChange} />
    )
    for (const view of VIEWS) {
      await expect.element(item(view)).toBeDisabled()
    }
    await item("Day").click({ force: true })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(pressed()).toEqual(["Week"])
  })

  it("disables a single item", async () => {
    await render(
      <ToggleGroup>
        <ToggleGroupItem value="a">Bold</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    )
    await expect.element(item("Italic")).toBeDisabled()
    await expect.element(item("Bold")).toBeEnabled()
  })
})

describe("ToggleGroup keyboard", () => {
  it("moves focus with the up and down arrows when vertical", async () => {
    await render(<Views multiple orientation="vertical" />)
    await item("Day").click()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(item("Week")).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(item("Week")).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(item("Day")).toHaveFocus()
  })

  it("moves focus with the arrow keys and toggles with Space and Enter", async () => {
    await render(<Views multiple />)
    await item("Day").click()
    expect(pressed()).toEqual(["Day"])
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(item("Week")).toHaveFocus()
    await userEvent.keyboard(" ")
    expect(pressed()).toEqual(["Day", "Week"])
    await userEvent.keyboard("{End}")
    await expect.element(item("Year")).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(pressed()).toEqual(["Day", "Week", "Year"])
    await userEvent.keyboard("{Home}")
    await expect.element(item("Day")).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(item("Year")).toHaveFocus()
  })

  it("is a single tab stop", async () => {
    await render(
      <div>
        <button type="button">Before</button>
        <Views defaultValue={["month"]} />
        <button type="button">After</button>
      </div>
    )
    page.getByRole("button", { name: "Before" }).element().focus()
    await userEvent.tab()
    await expect.element(item("Day")).toHaveFocus()
    await userEvent.tab()
    await expect
      .element(page.getByRole("button", { name: "After" }))
      .toHaveFocus()
  })
})

describe("ToggleGroup layout", () => {
  it.each([
    [0, 0],
    [1, 4],
    [2, 8],
    [4, 16],
  ])("puts a spacing of %i between items as %ipx", async (spacing, pixels) => {
    await render(<Views variant="outline" spacing={spacing} />)
    const first = item("Day").element().getBoundingClientRect()
    const second = item("Week").element().getBoundingClientRect()
    expect(Math.round(second.left - first.right)).toBe(pixels)
  })

  it("attaches outline items into one rounded strip", async () => {
    await render(<Views variant="outline" spacing={0} />)
    const first = getComputedStyle(item("Day").element())
    const middle = getComputedStyle(item("Week").element())
    const last = getComputedStyle(item("Year").element())
    expect(first.borderTopLeftRadius).not.toBe("0px")
    expect(first.borderTopRightRadius).toBe("0px")
    expect(middle.borderTopLeftRadius).toBe("0px")
    expect(middle.borderLeftWidth).toBe("0px")
    expect(last.borderTopRightRadius).not.toBe("0px")
  })

  it("stacks items vertically", async () => {
    await render(<Views variant="outline" orientation="vertical" />)
    const first = item("Day").element().getBoundingClientRect()
    const second = item("Week").element().getBoundingClientRect()
    expect(second.top).toBeGreaterThan(first.bottom - 1)
    expect(second.left).toBe(first.left)
    expect(second.width).toBe(first.width)
  })

  it.each([
    ["sm", 32],
    ["default", 36],
    ["lg", 40],
  ] as const)("sizes %s items at %ipx tall", async (size, height) => {
    await render(<Views size={size} />)
    for (const view of VIEWS) {
      expect(item(view).element().getBoundingClientRect().height).toBe(height)
    }
  })
})

describe("ToggleGroup segmented indicator", () => {
  it("sits on the pressed segment and slides to the next one", async () => {
    await render(<Views spacing={0} defaultValue={["week"]} />)
    await indicatorOn("Week")
    expect(indicator().getAttribute("aria-hidden")).toBe("true")
    await item("Year").click()
    await indicatorOn("Year")
  })

  it("animates the slide rather than jumping", async () => {
    await render(<Views spacing={0} defaultValue={["day"]} />)
    await indicatorOn("Day")
    const from = indicator().getBoundingClientRect().left
    const to = item("Year").element().getBoundingClientRect().left
    await item("Year").click()
    await frame()
    await frame()
    const midway = indicator().getBoundingClientRect().left
    expect(midway).toBeGreaterThan(from)
    expect(midway).toBeLessThan(to)
    await indicatorOn("Year")
  })

  it("does not animate into place on first render", async () => {
    await render(<Views spacing={0} defaultValue={["year"]} />)
    await frame()
    const target = box(item("Year").element())
    expect(box(indicator())).toEqual(target)
  })

  it("hides when nothing is pressed and comes back on press", async () => {
    await render(<Views spacing={0} defaultValue={["week"]} />)
    await indicatorOn("Week")
    await item("Week").click()
    await expect.poll(() => shown(indicator())).toBe(false)
    await item("Month").click()
    await expect.poll(() => shown(indicator())).toBe(true)
    await indicatorOn("Month")
  })

  it("hides while more than one segment is pressed", async () => {
    await render(<Views spacing={0} multiple defaultValue={["day"]} />)
    await indicatorOn("Day")
    await item("Month").click()
    await expect.poll(() => shown(indicator())).toBe(false)
    await item("Day").click()
    await indicatorOn("Month")
  })

  it("follows the pressed segment in a vertical group", async () => {
    await render(
      <Views spacing={0} orientation="vertical" defaultValue={["day"]} />
    )
    await indicatorOn("Day")
    await item("Month").click()
    await indicatorOn("Month")
    expect(indicator().getBoundingClientRect().top).toBeGreaterThan(
      item("Day").element().getBoundingClientRect().bottom
    )
  })

  it("tracks the segment when an earlier item grows", async () => {
    await render(<Renaming />)
    await indicatorOn("Year")
    const before = indicator().getBoundingClientRect().left
    await page.getByRole("button", { name: "Rename" }).click()
    await expect.element(item("Today and tomorrow")).toBeVisible()
    await indicatorOn("Year")
    expect(indicator().getBoundingClientRect().left).toBeGreaterThan(before)
  })

  it("is drawn only for attached default segments", async () => {
    await render(
      <div>
        <Views spacing={2} defaultValue={["week"]} />
        <Views spacing={0} variant="outline" defaultValue={["week"]} />
      </div>
    )
    await wait(50)
    expect(slot("toggle-group-indicator")).toBeNull()
  })
})
