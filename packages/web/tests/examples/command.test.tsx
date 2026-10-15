import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CommandDemo from "@/examples/command-demo"
import CommandDialogDemo from "@/examples/command-dialog"
import CommandDialogOpen from "@/examples/command-dialog-open"
import CommandEmptyExample from "@/examples/command-empty"
import { renderExample } from "@/tests/render-example"

const PROFILE = /^Profile/

test("Default", async () => {
  const { canvas, step } = await renderExample(<CommandDemo />)

  const input = canvas.getByRole("combobox")

  await step("highlights the first item and skips disabled ones", async () => {
    await expect(
      canvas.getByRole("option", { name: "Calendar" })
    ).toHaveAttribute("aria-selected", "true")
    await expect(
      canvas.getByRole("option", { name: "Calculator" })
    ).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(input)
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect(canvas.getByRole("option", { name: PROFILE })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  await step("filters items while typing", async () => {
    await userEvent.type(input, "bill")
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(1))
    await expect(canvas.getByRole("option")).toHaveTextContent("Billing")
  })

  await step("shows the empty state for no matches", async () => {
    await userEvent.clear(input)
    await userEvent.type(input, "zzz")
    await expect(await canvas.findByText("No results found.")).toBeVisible()
  })
})
test("Empty", async () => {
  const { canvas, step } = await renderExample(<CommandEmptyExample />)

  await step("shows the empty state with no items", async () => {
    await expect(canvas.getByText("No projects found.")).toBeVisible()
    await expect(canvas.queryAllByRole("option")).toHaveLength(0)
    await userEvent.type(canvas.getByRole("combobox"), "web")
    await expect(canvas.getByText("No projects found.")).toBeVisible()
  })
})
test("Dialog", async () => {
  const { canvas, step } = await renderExample(<CommandDialogDemo />)

  const trigger = canvas.getByRole("button", {
    name: "Open command palette",
  })

  await step("opens a named palette with focus in the search", async () => {
    await userEvent.click(trigger)
    const dialog = await screen.findByRole("dialog", {
      name: "Command Palette",
    })
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
test("Dialog Open", async () => {
  const { step } = await renderExample(<CommandDialogOpen />)

  await step("renders the palette open on mount", async () => {
    const dialog = await screen.findByRole("dialog", {
      name: "Command Palette",
    })
    await waitFor(() => expect(dialog).toBeVisible())
  })

  await step("filters items while typing", async () => {
    await userEvent.type(screen.getByRole("combobox"), "cal")
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
