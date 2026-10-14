import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const frameworks: SearchPickerItem[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "gatsby", label: "Gatsby", disabled: true },
]

const cities: SearchPickerItem[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "chi", label: "Chicago", group: "Americas" },
  { value: "lon", label: "London", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
]

type PickerProps = Partial<React.ComponentProps<typeof SearchPicker>>

function Picker(props: PickerProps) {
  return (
    <div className="p-8">
      <SearchPicker
        items={frameworks}
        placeholder="Select a framework"
        searchPlaceholder="Search frameworks..."
        emptyText="No framework found."
        aria-label="Framework"
        className="w-56"
        {...props}
      />
    </div>
  )
}

function Controlled({ initial }: { initial: string | null }) {
  const [value, setValue] = React.useState<string | null>(initial)
  return (
    <>
      <Picker value={value} onValueChange={setValue} />
      <span>Selected: {value ?? "none"}</span>
      <button type="button" onClick={() => setValue("nuxt")}>
        Pick Nuxt
      </button>
    </>
  )
}

const input = () => page.getByRole("combobox", { name: "Framework" })
const listbox = () => page.getByRole("listbox")
const option = (name: string) => page.getByRole("option", { name })
const showOptions = () => page.getByRole("button", { name: "Show options" })
const trigger = (name = "Framework") => page.getByRole("button", { name })
const drawer = () => page.getByRole("dialog")
const search = () => page.getByPlaceholder("Search frameworks...")

function options() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[role=option]"),
    (item) => item.textContent?.trim()
  )
}

function drawerItems() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[cmdk-item]"),
    (item) => item.textContent
  )
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

describe("SearchPicker on desktop", () => {
  it("renders a search field with the placeholder", async () => {
    await render(<Picker />)
    await expect.element(input()).toBeVisible()
    await expect
      .element(input())
      .toHaveAttribute("placeholder", "Select a framework")
    await expect.element(input()).toHaveValue("")
    await expect.element(listbox()).not.toBeInTheDocument()
  })

  it("lists every item from the options button", async () => {
    await render(<Picker />)
    await showOptions().click()
    await expect.element(listbox()).toBeVisible()
    expect(options()).toEqual(["Next.js", "Remix", "Astro", "Nuxt", "Gatsby"])
    await expect
      .element(option("Gatsby"))
      .toHaveAttribute("aria-disabled", "true")
  })

  it("filters the items as you type and shows the empty text", async () => {
    await render(<Picker />)
    await input().click()
    await userEvent.keyboard("ne")
    await expect.poll(options).toEqual(["Next.js"])
    await userEvent.fill(input(), "zz")
    await expect.poll(options).toEqual([])
    await expect.element(page.getByText("No framework found.")).toBeVisible()
  })

  it("selects an item with a click", async () => {
    const onValueChange = vi.fn()
    await render(<Picker onValueChange={onValueChange} />)
    await showOptions().click()
    await option("Astro").click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("astro")
    await expect.element(input()).toHaveValue("Astro")
    await expect.element(listbox()).not.toBeInTheDocument()
    await showOptions().click()
    await expect
      .element(option("Astro"))
      .toHaveAttribute("aria-selected", "true")
  })

  it("selects with the keyboard", async () => {
    const onValueChange = vi.fn()
    await render(<Picker onValueChange={onValueChange} />)
    await input().click()
    await userEvent.keyboard("rem")
    await expect.poll(options).toEqual(["Remix"])
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("remix")
    await expect.element(input()).toHaveValue("Remix")
  })

  it("does not select a disabled item", async () => {
    const onValueChange = vi.fn()
    await render(<Picker onValueChange={onValueChange} />)
    await showOptions().click()
    await option("Gatsby").click({ force: true })
    await wait(100)
    expect(onValueChange).not.toHaveBeenCalled()
    await expect.element(input()).toHaveValue("")
  })

  it("starts from the default value", async () => {
    await render(<Picker defaultValue="nuxt" />)
    await expect.element(input()).toHaveValue("Nuxt")
  })

  it("groups items under their labels", async () => {
    await render(
      <Picker items={cities} aria-label="City" placeholder="Select a city" />
    )
    await page.getByRole("button", { name: "Show options" }).click()
    const groups = listbox().getByRole("group").elements()
    expect(groups).toHaveLength(2)
    expect(groups[0]?.textContent).toBe("AmericasNew YorkChicago")
    expect(groups[1]?.textContent).toBe("EuropeLondonBerlin")
    await page.getByRole("combobox", { name: "City" }).fill("lo")
    await expect.poll(options).toEqual(["London"])
    await expect.element(page.getByText("Americas")).not.toBeInTheDocument()
  })

  it("follows a controlled value", async () => {
    await render(<Controlled initial="next" />)
    await expect.element(input()).toHaveValue("Next.js")
    await showOptions().click()
    await option("Remix").click()
    await expect.element(page.getByText("Selected: remix")).toBeVisible()
    await expect.element(input()).toHaveValue("Remix")
    await page.getByRole("button", { name: "Pick Nuxt" }).click()
    await expect.element(input()).toHaveValue("Nuxt")
  })

  it("keeps a fixed controlled value", async () => {
    const onValueChange = vi.fn()
    await render(<Picker value="next" onValueChange={onValueChange} />)
    await showOptions().click()
    await option("Astro").click()
    expect(onValueChange).toHaveBeenLastCalledWith("astro")
    await expect.element(input()).toHaveValue("Next.js")
  })

  it("can be disabled and marked invalid", async () => {
    const { rerender } = await render(<Picker disabled />)
    await expect.element(input()).toBeDisabled()
    await expect.element(showOptions()).toBeDisabled()
    await rerender(<Picker aria-invalid id="framework" />)
    await expect.element(input()).toHaveAttribute("aria-invalid", "true")
    await expect.element(input()).toHaveAttribute("id", "framework")
  })
})

describe("SearchPicker on mobile", () => {
  it("renders a trigger button with the placeholder", async () => {
    await page.viewport(390, 844)
    await render(<Picker />)
    await expect.element(trigger()).toHaveTextContent("Select a framework")
    await expect.element(trigger()).toHaveAttribute("data-placeholder", "")
    await expect.element(input()).not.toBeInTheDocument()
  })

  it("opens a drawer with the search field focused", async () => {
    await page.viewport(390, 844)
    await render(<Picker />)
    await trigger().click()
    await expect.element(drawer()).toBeVisible()
    await expect.element(drawer()).toHaveAccessibleName("Select a framework")
    await expect.element(search()).toHaveFocus()
    expect(drawerItems()).toEqual([
      "Next.js",
      "Remix",
      "Astro",
      "Nuxt",
      "Gatsby",
    ])
  })

  it("uses the title for the drawer heading", async () => {
    await page.viewport(390, 844)
    await render(<Picker title="Framework list" />)
    await trigger().click()
    await expect.element(drawer()).toHaveAccessibleName("Framework list")
    await expect
      .element(drawer().getByRole("heading", { name: "Framework list" }))
      .toBeVisible()
  })

  it("filters the items and shows the empty text", async () => {
    await page.viewport(390, 844)
    await render(<Picker />)
    await trigger().click()
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard("nu")
    await expect.poll(drawerItems).toEqual(["Nuxt"])
    await userEvent.fill(search(), "zz")
    await expect.poll(drawerItems).toEqual([])
    await expect.element(page.getByText("No framework found.")).toBeVisible()
  })

  it("selects an item and closes the drawer", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Picker onValueChange={onValueChange} />)
    await trigger().click()
    await page.getByRole("option", { name: "Astro" }).click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("astro")
    await expect.element(drawer()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveTextContent("Astro")
    await expect.element(trigger()).not.toHaveAttribute("data-placeholder")
    await trigger().click()
    await expect
      .element(page.getByRole("option", { name: "Astro" }))
      .toHaveAttribute("data-checked", "true")
  })

  it("selects with the keyboard", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Picker onValueChange={onValueChange} />)
    await trigger().click()
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("remix")
    await expect.element(trigger()).toHaveTextContent("Remix")
  })

  it("does not select a disabled item", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Picker onValueChange={onValueChange} />)
    await trigger().click()
    const gatsby = page.getByRole("option", { name: "Gatsby" }).element()
    if (gatsby instanceof HTMLElement) gatsby.click()
    await wait(100)
    expect(onValueChange).not.toHaveBeenCalled()
    await expect.element(drawer()).toBeVisible()
  })

  it("groups items under headings", async () => {
    await page.viewport(390, 844)
    await render(<Picker items={cities} aria-label="City" placeholder="City" />)
    await trigger("City").click()
    await expect.element(drawer().getByText("Americas")).toBeVisible()
    await expect.element(drawer().getByText("Europe")).toBeVisible()
    await page.getByPlaceholder("Search frameworks...").fill("ber")
    await expect.poll(drawerItems).toEqual(["Berlin"])
    await expect.element(drawer().getByText("Americas")).not.toBeVisible()
  })

  it("shows the default value and follows a controlled one", async () => {
    await page.viewport(390, 844)
    const { rerender } = await render(<Picker defaultValue="nuxt" />)
    await expect.element(trigger()).toHaveTextContent("Nuxt")
    await rerender(<Controlled initial={null} />)
    await expect.element(trigger()).toHaveTextContent("Select a framework")
    await page.getByRole("button", { name: "Pick Nuxt" }).click()
    await expect.element(trigger()).toHaveTextContent("Nuxt")
    await trigger().click()
    await page.getByRole("option", { name: "Remix" }).click()
    await expect.element(page.getByText("Selected: remix")).toBeVisible()
    await expect.element(trigger()).toHaveTextContent("Remix")
  })

  it("closes from the close button and Escape", async () => {
    await page.viewport(390, 844)
    await render(<Picker showCloseButton closeLabel="Cancel" />)
    await trigger().click()
    await page.getByRole("button", { name: "Cancel" }).click()
    await expect.element(drawer()).not.toBeInTheDocument()
    await trigger().click()
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard("{Escape}")
    await expect.element(drawer()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("can be disabled and marked invalid", async () => {
    await page.viewport(390, 844)
    const { rerender } = await render(<Picker disabled />)
    await expect.element(trigger()).toBeDisabled()
    await rerender(<Picker aria-invalid />)
    await expect.element(trigger()).toHaveAttribute("aria-invalid", "true")
  })
})
