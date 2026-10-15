import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import ComboboxDemo from "@/examples/combobox-demo"
import ComboboxDisabled from "@/examples/combobox-disabled"
import ComboboxGrouped from "@/examples/combobox-grouped"
import ComboboxHighlightMatch from "@/examples/combobox-highlight-match"
import ComboboxMultiple from "@/examples/combobox-multiple"
import ComboboxWithClearButton from "@/examples/combobox-with-clear-button"
import { renderExample } from "@/tests/render-example"

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "Gatsby"]

function ComboboxOpenByDefault() {
  return (
    <div className="w-72">
      <Combobox defaultOpen items={frameworks}>
        <ComboboxInput placeholder="Select a framework" disabled={false} />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<ComboboxDemo />)

  const input = canvas.getByRole("combobox")

  await step("filters the options while typing", async () => {
    await userEvent.click(input)
    await userEvent.type(input, "re")
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1))
    await expect(input).toHaveAttribute("aria-expanded", "true")
  })

  await step("selects the highlighted option with Enter", async () => {
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await waitFor(() => expect(input).toHaveValue("Remix"))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })

  await step("shows the empty state for no matches", async () => {
    await userEvent.clear(input)
    await userEvent.type(input, "zzz")
    await expect(
      await screen.findByText("No framework found.")
    ).toBeInTheDocument()
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"))
  })
})
test("Open By Default", async () => {
  const { canvas, step } = await renderExample(<ComboboxOpenByDefault />)

  const input = canvas.getByRole("combobox")

  await step("renders the full list open on mount", async () => {
    const listbox = await screen.findByRole("listbox")
    await waitFor(() => expect(listbox).toBeVisible())
    await expect(within(listbox).getAllByRole("option")).toHaveLength(
      frameworks.length
    )
    await expect(input).toHaveAttribute("aria-expanded", "true")
  })

  await step("chooses an option and closes", async () => {
    await userEvent.click(screen.getByRole("option", { name: "Astro" }))
    await waitFor(() => expect(input).toHaveValue("Astro"))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })
})
test("With Clear Button", async () => {
  const { canvas } = await renderExample(<ComboboxWithClearButton />)

  const input = canvas.getByRole("combobox")
  await expect(input).toHaveValue("Astro")
  await userEvent.click(canvas.getByRole("button", { name: "Clear" }))
  await waitFor(() => expect(input).toHaveValue(""))
})
test("Disabled", async () => {
  const { canvas } = await renderExample(<ComboboxDisabled />)

  await expect(canvas.getByRole("combobox")).toBeDisabled()
  await expect(
    canvas.getByRole("button", { name: "Show options" })
  ).toBeDisabled()
  await userEvent.tab()
  await expect(canvas.getByRole("combobox")).not.toHaveFocus()
})
test("Grouped", async () => {
  const { canvas } = await renderExample(<ComboboxGrouped />)

  await userEvent.click(canvas.getByRole("button", { name: "Show options" }))
  const europe = await screen.findByRole("group", { name: "Europe" })
  await waitFor(() => expect(europe).toBeVisible())
  await expect(
    within(screen.getByRole("listbox")).getAllByRole("group")
  ).toHaveLength(3)
  await expect(screen.getByRole("option", { name: "Istanbul" })).toBeVisible()
})
test("Highlight Match", async () => {
  const { canvas } = await renderExample(<ComboboxHighlightMatch />)

  await userEvent.type(canvas.getByRole("combobox"), "kit")
  const option = await screen.findByRole("option", { name: "SvelteKit" })
  await expect(option.querySelector(".font-semibold")).toHaveTextContent("Kit")
})
test("Multiple", async () => {
  const { canvas, step } = await renderExample(<ComboboxMultiple />)

  const input = canvas.getByRole("combobox")

  await step("adds a chip when an option is chosen", async () => {
    await userEvent.click(input)
    await userEvent.click(await screen.findByRole("option", { name: "Nuxt" }))
    await expect(await canvas.findByText("Nuxt")).toBeVisible()
    await expect(screen.getByRole("option", { name: "Nuxt" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  await step("removes the last chip with Backspace", async () => {
    await userEvent.keyboard("{Escape}")
    await userEvent.click(input)
    await userEvent.keyboard("{Backspace}")
    await waitFor(() => expect(canvas.queryByText("Nuxt")).toBeNull())
    await expect(canvas.getByText("Astro")).toBeVisible()
  })
})
