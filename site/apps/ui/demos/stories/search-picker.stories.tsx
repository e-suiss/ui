// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"

const frameworks: SearchPickerItem[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "gatsby", label: "Gatsby", disabled: true },
]

const cities: SearchPickerItem[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "chi", label: "Chicago", group: "Americas" },
  { value: "sao", label: "São Paulo", group: "Americas" },
  { value: "lon", label: "London", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
  { value: "ist", label: "Istanbul", group: "Europe" },
  { value: "tyo", label: "Tokyo", group: "Asia" },
  { value: "sin", label: "Singapore", group: "Asia" },
]

const meta = {
  title: "Patterns/Search Picker",
  component: SearchPicker,
  args: {
    items: frameworks,
    placeholder: "Select a framework",
    searchPlaceholder: "Search frameworks...",
    emptyText: "No framework found.",
    "aria-label": "Framework",
    className: "w-56",
  },
} satisfies Meta<typeof SearchPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
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
  },
}

export const WithValue: Story = {
  args: { defaultValue: "astro" },
  play: async ({ canvas, step }) => {
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
  },
}

export const Grouped: Story = {
  args: {
    items: cities,
    placeholder: "Select a city",
    searchPlaceholder: "Search cities...",
    emptyText: "No city found.",
    "aria-label": "City",
  },
  play: async ({ canvas, step }) => {
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
  },
}

export const WithTitle: Story = {
  args: { title: "Framework" },
}

export const WithCloseButton: Story = {
  args: { showCloseButton: true },
}

export const WithCloseLabel: Story = {
  args: { showCloseButton: true, closeLabel: "Cancel" },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    await step("disables the field", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Framework" })
      ).toBeDisabled()
    })
  },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
  play: async ({ canvas, step }) => {
    await step("exposes the invalid state", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Framework" })
      ).toHaveAttribute("aria-invalid", "true")
    })
  },
}

function ControlledExample(args: React.ComponentProps<typeof SearchPicker>) {
  const [value, setValue] = React.useState<string | null>("next")

  return (
    <div className="flex flex-col items-start gap-2">
      <SearchPicker {...args} value={value} onValueChange={setValue} />
      <p className="text-sm text-label-secondary">
        Selected: {value ?? "none"}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  play: async ({ canvas, step }) => {
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
  },
}

export const Floating: Story = {
  args: { floating: true },
}
