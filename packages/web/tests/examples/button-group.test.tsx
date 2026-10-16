import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ButtonGroupDemo from "@/examples/button-group-demo"
import ButtonGroupOrientation from "@/examples/button-group-orientation"
import ButtonGroupPagination from "@/examples/button-group-pagination"
import ButtonGroupPlain from "@/examples/button-group-plain"
import ButtonGroupSplitButton from "@/examples/button-group-split-button"
import ButtonGroupWithDropdownMenu from "@/examples/button-group-with-dropdown-menu"
import ButtonGroupWithInput from "@/examples/button-group-with-input"
import ButtonGroupWithInputGroup from "@/examples/button-group-with-input-group"
import ButtonGroupWithPopover from "@/examples/button-group-with-popover"
import ButtonGroupWithSelect from "@/examples/button-group-with-select"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SELECT_TRIGGER = byBase<{ role: string; name: string | RegExp }>({
  base: { role: "combobox", name: "Currency" },
  radix: { role: "combobox", name: "Currency" },
  aria: { role: "button", name: /Currency$/ },
})

test("Default", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupDemo />)

  await step("groups the buttons", async () => {
    await expect(canvas.getAllByRole("group")).toHaveLength(4)
    await expect(canvas.getByRole("button", { name: "Go back" })).toBeVisible()
  })

  await step("opens the overflow menu and closes it with Escape", async () => {
    const trigger = canvas.getByRole("button", { name: "More options" })
    await userEvent.click(trigger)
    const item = await screen.findByRole("menuitem", {
      name: "Mark as read",
    })
    await waitFor(() => expect(item).toBeVisible())
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
test("Orientation", async () => {
  const { canvas } = await renderExample(<ButtonGroupOrientation />)

  const group = canvas.getByRole("group", { name: "Media controls" })
  await expect(group).toHaveAttribute("data-orientation", "vertical")
  const zoomIn = canvas.getByRole("button", { name: "Zoom in" })
  const zoomOut = canvas.getByRole("button", { name: "Zoom out" })
  await expect(zoomIn.getBoundingClientRect().bottom).toBeLessThanOrEqual(
    zoomOut.getBoundingClientRect().top + 1
  )
})
test("Split Button", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupSplitButton />)

  const publish = canvas.getByRole("button", { name: "Publish" })
  const more = canvas.getByRole("button", { name: "More options" })

  await step("joins both halves in one group", async () => {
    const group = canvas.getByRole("group")
    await expect(group).toContainElement(publish)
    await expect(group).toContainElement(more)
    await expect(
      Math.abs(
        more.getBoundingClientRect().left -
          publish.getBoundingClientRect().right
      )
    ).toBeLessThanOrEqual(2)
  })

  await step("moves between the halves with Tab", async () => {
    await userEvent.tab()
    await expect(publish).toHaveFocus()
    await userEvent.tab()
    await expect(more).toHaveFocus()
  })
})
test("With Input", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupWithInput />)

  const input = canvas.getByRole("textbox", { name: "Search" })
  const button = canvas.getByRole("button", { name: "Search" })

  await step("types into the input inside the group", async () => {
    await userEvent.type(input, "grill")
    await expect(input).toHaveValue("grill")
  })

  await step("moves from the input to its button with Tab", async () => {
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(
      Math.abs(
        button.getBoundingClientRect().left -
          input.getBoundingClientRect().right
      )
    ).toBeLessThanOrEqual(2)
  })
})
test("With Input Group", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupWithInputGroup />)

  const input = canvas.getByRole("textbox", { name: "Message" })
  const voice = canvas.getByRole("button", { name: "Voice mode" })

  await step("types into the input group", async () => {
    await userEvent.type(input, "Table 4 is ready")
    await expect(input).toHaveValue("Table 4 is ready")
  })

  await step("reaches the voice button and shows its tooltip", async () => {
    await userEvent.tab()
    await expect(voice).toHaveFocus()
    await waitFor(() => expect(screen.getByText("Voice mode")).toBeVisible(), {
      timeout: 3000,
    })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByText("Voice mode")).toBeNull())
  })
})
test("With Dropdown Menu", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupWithDropdownMenu />)

  const trigger = canvas.getByRole("button", { name: "More options" })

  await step("opens the menu from the group", async () => {
    await userEvent.click(trigger)
    const item = await screen.findByRole("menuitem", { name: "Copy link" })
    await waitFor(() => expect(item).toBeVisible())
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
  })

  await step("closes after choosing an item", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: "Copy link" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
test("With Select", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupWithSelect />)

  const trigger = canvas.getByRole(SELECT_TRIGGER.role, {
    name: SELECT_TRIGGER.name,
  })
  const amount = canvas.getByRole("textbox", { name: "Amount" })

  await step("picks a currency from the select", async () => {
    await expect(trigger).toHaveTextContent("$")
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("option", { name: "€" }))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("€")
  })

  await step("types an amount next to it", async () => {
    await userEvent.type(amount, "12.50")
    await expect(amount).toHaveValue("12.50")
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Send" })).toHaveFocus()
  })
})
test("With Popover", async () => {
  const { canvas } = await renderExample(<ButtonGroupWithPopover />)

  const trigger = canvas.getByRole("button", { name: "Open popover" })
  await userEvent.click(trigger)
  const popover = await screen.findByRole("dialog", {
    name: "Start a new task",
  })
  await waitFor(() => expect(popover).toBeVisible())
  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  await waitFor(() => expect(trigger).toHaveFocus())
})
test("Pagination", async () => {
  const { canvas } = await renderExample(<ButtonGroupPagination />)

  await expect(canvas.getByRole("group", { name: "Pagination" })).toBeVisible()
  await expect(canvas.getByRole("button", { name: "2" })).toHaveAttribute(
    "aria-current",
    "page"
  )
})

test("Plain", async () => {
  const { canvas, step } = await renderExample(<ButtonGroupPlain />)

  await step("rounds the plain buttons fully", async () => {
    const back = canvas.getByRole("button", { name: "Back" })
    await expect(back).toHaveAttribute("data-variant", "plain")
    await expect(back).toHaveAttribute("data-size", "default")
    await expect(getComputedStyle(back).borderStartStartRadius).toBe(
      getComputedStyle(back).borderEndEndRadius
    )
    await expect(
      Number.parseFloat(getComputedStyle(back).borderEndEndRadius)
    ).toBeGreaterThan(0)
  })
})
