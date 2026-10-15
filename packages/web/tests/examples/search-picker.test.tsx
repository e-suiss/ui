import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SearchPickerControlled from "@/examples/search-picker-controlled"
import SearchPickerDemo from "@/examples/search-picker-demo"
import SearchPickerDisabled from "@/examples/search-picker-disabled"
import SearchPickerGrouped from "@/examples/search-picker-grouped"
import SearchPickerInvalid from "@/examples/search-picker-invalid"
import SearchPickerWithValue from "@/examples/search-picker-with-value"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<SearchPickerDemo />)

  const input = canvas.getByRole("combobox", { name: "Framework" })

  await step("opens the list with a disabled option", async () => {
    await userEvent.click(input)
    const listbox = await screen.findByRole("listbox")
    await waitFor(() => expect(listbox).toBeVisible())
    await expect(
      screen.getByRole("option", { name: "Gatsby" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("filters as the user types and picks a match", async () => {
    await userEvent.type(input, "sv")
    await waitFor(() =>
      expect(screen.queryByRole("option", { name: "Remix" })).toBeNull()
    )
    await userEvent.click(screen.getByRole("option", { name: "SvelteKit" }))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(input).toHaveValue("SvelteKit")
  })

  await step("shows the empty text when nothing matches", async () => {
    await userEvent.clear(input)
    await userEvent.type(input, "zzz")
    const empty = await screen.findByText("No framework found.")
    await waitFor(() => expect(empty).toBeVisible())
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<SearchPickerWithValue />)

  const input = canvas.getByRole("combobox", { name: "Framework" })

  await step("shows the initial value in the field", async () => {
    await expect(input).toHaveValue("Astro")
  })

  await step("marks the current value in the list", async () => {
    await userEvent.click(input)
    await expect(
      await screen.findByRole("option", { name: "Astro" })
    ).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })
})
test("Grouped", async () => {
  const { canvas, step } = await renderExample(<SearchPickerGrouped />)

  const input = canvas.getByRole("combobox", { name: "City" })

  await step("lists items under their group labels", async () => {
    await userEvent.click(input)
    const europe = await screen.findByRole("group", { name: "Europe" })
    await waitFor(() => expect(europe).toBeVisible())
    await expect(
      within(europe).getByRole("option", { name: "Istanbul" })
    ).toBeVisible()
    await expect(screen.getByRole("option", { name: "Tokyo" })).toBeVisible()
  })

  await step("filters across groups and picks a match", async () => {
    await userEvent.type(input, "lon")
    await waitFor(() =>
      expect(screen.queryByRole("option", { name: "Tokyo" })).toBeNull()
    )
    await userEvent.click(screen.getByRole("option", { name: "London" }))
    await waitFor(() => expect(input).toHaveValue("London"))
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<SearchPickerDisabled />)

  await step("disables the field", async () => {
    await expect(
      canvas.getByRole("combobox", { name: "Framework" })
    ).toBeDisabled()
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<SearchPickerInvalid />)

  await step("exposes the invalid state", async () => {
    await expect(
      canvas.getByRole("combobox", { name: "Framework" })
    ).toHaveAttribute("aria-invalid", "true")
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<SearchPickerControlled />)

  const input = canvas.getByRole("combobox", { name: "Framework" })

  await step("starts with the controlled value", async () => {
    await expect(input).toHaveValue("Next.js")
    await expect(canvas.getByText("Selected: next")).toBeVisible()
  })

  await step("reports a new choice to the owner", async () => {
    await userEvent.click(input)
    await userEvent.click(await screen.findByRole("option", { name: "Nuxt" }))
    await waitFor(() =>
      expect(canvas.getByText("Selected: nuxt")).toBeVisible()
    )
    await expect(input).toHaveValue("Nuxt")
  })
})
