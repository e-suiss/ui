import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TabBarDemo from "@/examples/tab-bar-demo"
import TabBarDisabledItem from "@/examples/tab-bar-disabled-item"
import TabBarFitsWithoutMore from "@/examples/tab-bar-fits-without-more"
import TabBarLinks from "@/examples/tab-bar-links"
import TabBarOpen from "@/examples/tab-bar-open"
import TabBarOverflowIntoMore from "@/examples/tab-bar-overflow-into-more"
import { renderExample } from "@/tests/render-example"

const defaultItems = ["Home", "Nominees", "Directory", "Collections"]
const manyItems = [...defaultItems, "Market", "Academy", "Conferences"]

test("Default", async () => {
  const { canvas, step } = await renderExample(<TabBarDemo />)

  const nav = canvas.getByRole("navigation", { name: "Main" })
  const more = within(nav).getByRole("button", { name: "More" })

  await step("marks the tapped item as active", async () => {
    const nominees = within(nav).getByRole("button", { name: "Nominees" })
    await userEvent.click(nominees)
    await expect(nominees).toHaveAttribute("aria-current", "page")
    await expect(
      within(nav).getByRole("button", { name: "Home" })
    ).not.toHaveAttribute("aria-current")
  })

  await step("opens the sections from More", async () => {
    await userEvent.click(more)
    await expect(more).toHaveAttribute("aria-expanded", "true")
    await expect(
      await within(nav).findByRole("link", { name: "Site of the Day" })
    ).toBeInTheDocument()
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await expect(more).toHaveAttribute("aria-expanded", "false")
    await expect(more).toHaveFocus()
    await waitFor(() =>
      expect(
        within(nav).queryByRole("link", { name: "Site of the Day" })
      ).toBeNull()
    )
  })
})
test("Open", async () => {
  const { canvas, step } = await renderExample(<TabBarOpen />)

  await step("opens on mount and closes on an outside click", async () => {
    const more = canvas.getByRole("button", { name: "More" })
    await expect(more).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByRole("link", { name: "Professionals" })
    ).toBeInTheDocument()
    await userEvent.click(canvas.getByText("Card 1"))
    await expect(more).toHaveAttribute("aria-expanded", "false")
  })
})
test("Fits Without More", async () => {
  const { canvas, step } = await renderExample(<TabBarFitsWithoutMore />)

  await step("hides More when every item fits", async () => {
    await expect(canvas.getAllByRole("button")).toHaveLength(3)
    await expect(canvas.queryByRole("button", { name: "More" })).toBeNull()
  })
})
test("Overflow Into More", async () => {
  const { canvas, step } = await renderExample(<TabBarOverflowIntoMore />)

  await step("keeps every item reachable at desktop width", async () => {
    const nav = canvas.getByRole("navigation", { name: "Main" })
    for (const name of manyItems) {
      await expect(within(nav).getByRole("button", { name })).toBeVisible()
    }
  })
})
test("Links", async () => {
  const { canvas, step } = await renderExample(<TabBarLinks />)

  const nav = canvas.getByRole("navigation", { name: "Main" })

  await step("renders every item as a link to its route", async () => {
    await expect(within(nav).getAllByRole("link")).toHaveLength(
      defaultItems.length
    )
    for (const item of defaultItems) {
      await expect(
        within(nav).getByRole("link", { name: item })
      ).toHaveAttribute("href", `#${item.toLowerCase()}`)
    }
  })

  await step("marks only the active link as the current page", async () => {
    await expect(
      within(nav).getByRole("link", { name: "Home" })
    ).toHaveAttribute("aria-current", "page")
    for (const item of defaultItems.slice(1)) {
      await expect(
        within(nav).getByRole("link", { name: item })
      ).not.toHaveAttribute("aria-current")
    }
  })

  await step("reaches the links from the keyboard", async () => {
    await userEvent.tab()
    await expect(within(nav).getByRole("link", { name: "Home" })).toHaveFocus()
    await userEvent.tab()
    await expect(
      within(nav).getByRole("link", { name: "Nominees" })
    ).toHaveFocus()
  })
})
test("Disabled Item", async () => {
  const { canvas, step } = await renderExample(<TabBarDisabledItem />)

  await step("disables the item", async () => {
    await expect(
      canvas.getByRole("button", { name: "Directory" })
    ).toBeDisabled()
    await expect(canvas.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
