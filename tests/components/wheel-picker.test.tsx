import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Plum",
]

function Fruits({
  defaultValue = "Lemon",
  disabled = [],
  onValueChange,
}: {
  defaultValue?: string
  disabled?: string[]
  onValueChange?: (value: string) => void
}) {
  return (
    <div style={{ width: 320 }}>
      <WheelPicker>
        <WheelPickerColumn
          aria-label="Fruit"
          defaultValue={defaultValue}
          {...(onValueChange ? { onValueChange } : {})}
        >
          {fruits.map((fruit) => (
            <WheelPickerItem
              key={fruit}
              value={fruit}
              disabled={disabled.includes(fruit)}
            >
              {fruit}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    </div>
  )
}

function Controlled({
  onValueChange,
}: {
  onValueChange: (value: string) => void
}) {
  const [value, setValue] = React.useState("Cherry")
  return (
    <div style={{ width: 320 }}>
      <button type="button" onClick={() => setValue("Pear")}>
        Pick pear
      </button>
      <WheelPicker>
        <WheelPickerColumn
          aria-label="Fruit"
          value={value}
          onValueChange={(next) => {
            setValue(next)
            onValueChange(next)
          }}
        >
          {fruits.map((fruit) => (
            <WheelPickerItem key={fruit} value={fruit}>
              {fruit}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    </div>
  )
}

const listbox = () => page.getByRole("listbox", { name: "Fruit" })
const option = (name: string) => page.getByRole("option", { name, exact: true })

function column() {
  return listbox().element() as HTMLElement
}

function centered() {
  const box = column().getBoundingClientRect()
  const middle = box.top + box.height / 2
  let closest: { value: string | undefined; distance: number } = {
    value: undefined,
    distance: Number.POSITIVE_INFINITY,
  }
  for (const item of column().querySelectorAll<HTMLElement>("[role=option]")) {
    const rect = item.getBoundingClientRect()
    const distance = Math.abs(rect.top + rect.height / 2 - middle)
    if (distance < closest.distance) {
      closest = { value: item.dataset.value, distance }
    }
  }
  return closest.distance < 1 ? closest.value : undefined
}

function frame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function centeredOn(value: string) {
  await expect.poll(centered).toBe(value)
  await settled()
}

async function settled(element = column()) {
  let last = element.scrollTop
  let still = 0
  while (still < 6) {
    await frame()
    const top = element.scrollTop
    still = top === last ? still + 1 : 0
    last = top
  }
}

function selected() {
  return Array.from(
    column().querySelectorAll<HTMLElement>("[aria-selected=true]"),
    (item) => item.dataset.value
  )
}

describe("WheelPicker", () => {
  it("exposes a labelled listbox with one option per item", async () => {
    await render(<Fruits />)
    await expect.element(listbox()).toBeVisible()
    expect(listbox().getByRole("option").elements()).toHaveLength(10)
  })

  it("centers and selects the default value on mount", async () => {
    await render(<Fruits defaultValue="Mango" />)
    await expect.poll(centered).toBe("Mango")
    expect(selected()).toEqual(["Mango"])
    await expect.element(option("Mango")).toHaveAttribute("data-selected")
    expect(column().getAttribute("aria-activedescendant")).toBe(
      option("Mango").element().id
    )
  })

  it("centers the first item when the value is missing", async () => {
    await render(<Fruits defaultValue="Kiwi" />)
    await expect.poll(centered).toBe("Apple")
    expect(selected()).toEqual([])
  })

  it("steps through items with the arrow keys", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Lemon")
    await settled()
    column().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith("Mango")
    await centeredOn("Mango")
    expect(selected()).toEqual(["Mango"])

    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    expect(onValueChange).toHaveBeenLastCalledWith("Grape")
    await expect.poll(centered).toBe("Grape")
    expect(column().getAttribute("aria-activedescendant")).toBe(
      option("Grape").element().id
    )
  })

  it("keeps quick key presses made while a scroll is finishing", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await settled()
    column().focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(centered).toBe("Mango")
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await settled()
    await centeredOn("Grape")
    expect(onValueChange).toHaveBeenLastCalledWith("Grape")
    expect(selected()).toEqual(["Grape"])
  })

  it("jumps with Home, End, PageDown and PageUp and clamps at the ends", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await settled()
    column().focus()
    await userEvent.keyboard("{End}")
    expect(onValueChange).toHaveBeenLastCalledWith("Plum")
    await centeredOn("Plum")
    await userEvent.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenCalledTimes(1)

    await userEvent.keyboard("{Home}")
    expect(onValueChange).toHaveBeenLastCalledWith("Apple")
    await centeredOn("Apple")
    await userEvent.keyboard("{ArrowUp}")
    expect(onValueChange).toHaveBeenCalledTimes(2)

    await userEvent.keyboard("{PageDown}")
    expect(onValueChange).toHaveBeenLastCalledWith("Mango")
    await centeredOn("Mango")
    await userEvent.keyboard("{PageDown}")
    expect(onValueChange).toHaveBeenLastCalledWith("Plum")
    await centeredOn("Plum")
    await userEvent.keyboard("{PageUp}")
    expect(onValueChange).toHaveBeenLastCalledWith("Lemon")
    await expect.poll(centered).toBe("Lemon")
  })

  it("selects the item that scrolling leaves in the center", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Lemon")
    const height = option("Apple").element().getBoundingClientRect().height
    column().scrollTo({ top: height * 7 })
    await expect.poll(() => onValueChange.mock.lastCall).toEqual(["Peach"])
    await expect.poll(centered).toBe("Peach")
    expect(selected()).toEqual(["Peach"])
  })

  it("snaps a scroll that stops between items to the nearest one", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits defaultValue="Apple" onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Apple")
    const height = option("Apple").element().getBoundingClientRect().height
    column().scrollTo({ top: height * 2.3 })
    await expect.poll(centered).toBe("Cherry")
    await expect.poll(() => onValueChange.mock.lastCall).toEqual(["Cherry"])
  })

  it("selects an item when it is clicked", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Lemon")
    await option("Orange").click()
    expect(onValueChange).toHaveBeenCalledWith("Orange")
    await expect.poll(centered).toBe("Orange")
    expect(selected()).toEqual(["Orange"])
  })

  it("does not report a change when the selected item is clicked", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Lemon")
    await option("Lemon").click()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("scrolls to a new controlled value", async () => {
    const onValueChange = vi.fn()
    await render(<Controlled onValueChange={onValueChange} />)
    await expect.poll(centered).toBe("Cherry")
    await page.getByRole("button", { name: "Pick pear" }).click()
    await expect.poll(centered).toBe("Pear")
    expect(selected()).toEqual(["Pear"])
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("keeps independent values per column", async () => {
    const onHour = vi.fn()
    const onMinute = vi.fn()
    await render(
      <WheelPicker>
        <WheelPickerColumn
          aria-label="Hour"
          defaultValue="10"
          onValueChange={onHour}
        >
          {["09", "10", "11"].map((value) => (
            <WheelPickerItem key={value} value={value}>
              {value}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
        <WheelPickerColumn
          aria-label="Minute"
          defaultValue="30"
          onValueChange={onMinute}
        >
          {["00", "15", "30", "45"].map((value) => (
            <WheelPickerItem key={value} value={value}>
              {value}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    )
    const minute = page
      .getByRole("listbox", { name: "Minute" })
      .element() as HTMLElement
    await settled(minute)
    minute.focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(onMinute).toHaveBeenLastCalledWith("45")
    expect(onHour).not.toHaveBeenCalled()
    await expect
      .element(
        page
          .getByRole("listbox", { name: "Hour" })
          .getByRole("option", { name: "10" })
      )
      .toHaveAttribute("aria-selected", "true")
  })
})

describe("WheelPicker disabled items", () => {
  it("marks disabled items for assistive technology", async () => {
    await render(<Fruits disabled={["Mango"]} />)
    await expect
      .element(option("Mango"))
      .toHaveAttribute("aria-disabled", "true")
    await expect.element(option("Lemon")).not.toHaveAttribute("aria-disabled")
  })

  it("skips disabled items with the arrow keys", async () => {
    const onValueChange = vi.fn()
    await render(
      <Fruits disabled={["Mango", "Orange"]} onValueChange={onValueChange} />
    )
    await settled()
    column().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith("Peach")
    await centeredOn("Peach")
    await userEvent.keyboard("{ArrowUp}")
    expect(onValueChange).toHaveBeenLastCalledWith("Lemon")
  })

  it("stops on the last enabled item at either end", async () => {
    const onValueChange = vi.fn()
    await render(
      <Fruits disabled={["Apple", "Plum"]} onValueChange={onValueChange} />
    )
    await settled()
    column().focus()
    await userEvent.keyboard("{End}")
    expect(onValueChange).toHaveBeenLastCalledWith("Pear")
    await centeredOn("Pear")
    await userEvent.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenCalledTimes(1)

    await userEvent.keyboard("{Home}")
    expect(onValueChange).toHaveBeenLastCalledWith("Banana")
    await centeredOn("Banana")
    await userEvent.keyboard("{ArrowUp}")
    expect(onValueChange).toHaveBeenCalledTimes(2)
  })

  it("ignores clicks on a disabled item", async () => {
    const onValueChange = vi.fn()
    await render(<Fruits disabled={["Mango"]} onValueChange={onValueChange} />)
    await settled()
    option("Mango")
      .element()
      .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    await settled()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(selected()).toEqual(["Lemon"])
  })

  it("rolls back to the nearest enabled item when scrolling stops on a disabled one", async () => {
    const onValueChange = vi.fn()
    await render(
      <Fruits
        defaultValue="Apple"
        disabled={["Mango", "Orange"]}
        onValueChange={onValueChange}
      />
    )
    await settled()
    const height = option("Apple").element().getBoundingClientRect().height
    column().scrollTo({ top: height * 6 })
    await expect.poll(() => onValueChange.mock.lastCall).toEqual(["Peach"])
    await centeredOn("Peach")
    expect(selected()).toEqual(["Peach"])
  })

  it("prefers the item above when both neighbours are equally close", async () => {
    const onValueChange = vi.fn()
    await render(
      <Fruits
        defaultValue="Apple"
        disabled={["Mango"]}
        onValueChange={onValueChange}
      />
    )
    await settled()
    const height = option("Apple").element().getBoundingClientRect().height
    column().scrollTo({ top: height * 5 })
    await expect.poll(() => onValueChange.mock.lastCall).toEqual(["Lemon"])
    await centeredOn("Lemon")
  })

  it("rolls back even when the nearest enabled item is already selected", async () => {
    await render(<Fruits disabled={["Mango"]} />)
    await settled()
    const height = option("Apple").element().getBoundingClientRect().height
    column().scrollTo({ top: height * 5 })
    await centeredOn("Lemon")
    expect(selected()).toEqual(["Lemon"])
  })
})
