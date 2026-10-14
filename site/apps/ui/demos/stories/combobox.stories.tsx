// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "Gatsby"]

const timezones = [
  {
    value: "Americas",
    items: ["New York", "Chicago", "Los Angeles", "São Paulo"],
  },
  {
    value: "Europe",
    items: ["London", "Berlin", "Istanbul", "Madrid"],
  },
  {
    value: "Asia",
    items: ["Tokyo", "Singapore", "Dubai"],
  },
]

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: {
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Combobox {...args} items={frameworks}>
      <ComboboxInput
        placeholder="Select a framework"
        disabled={args.disabled}
      />
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
  ),
  play: async ({ canvas, step }) => {
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
      await waitFor(() =>
        expect(input).toHaveAttribute("aria-expanded", "false")
      )
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ canvas, step }) => {
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
  },
}

export const WithClearButton: Story = {
  render: (args) => (
    <Combobox {...args} items={frameworks} defaultValue="Astro">
      <ComboboxInput placeholder="Select a framework" showClear />
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
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox")
    await expect(input).toHaveValue("Astro")
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }))
    await waitFor(() => expect(input).toHaveValue(""))
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox")).toBeDisabled()
    await expect(
      canvas.getByRole("button", { name: "Show options" })
    ).toBeDisabled()
    await userEvent.tab()
    await expect(canvas.getByRole("combobox")).not.toHaveFocus()
  },
}

export const Grouped: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show options" }))
    const europe = await screen.findByRole("group", { name: "Europe" })
    await waitFor(() => expect(europe).toBeVisible())
    await expect(
      within(screen.getByRole("listbox")).getAllByRole("group")
    ).toHaveLength(3)
    await expect(screen.getByRole("option", { name: "Istanbul" })).toBeVisible()
  },
  render: (args) => (
    <Combobox {...args} items={timezones}>
      <ComboboxInput placeholder="Select a city" />
      <ComboboxContent>
        <ComboboxEmpty>No city found.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof timezones)[number], index: number) => (
            <ComboboxGroup key={group.value} items={group.items}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

function HighlightedMatch({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (start < 0) return text
  return (
    <span>
      {text.slice(0, start)}
      <span className="font-semibold">
        {text.slice(start, start + query.length)}
      </span>
      {text.slice(start + query.length)}
    </span>
  )
}

function HighlightMatchCombobox() {
  const [query, setQuery] = React.useState("")
  return (
    <Combobox
      items={frameworks}
      inputValue={query}
      onInputValueChange={setQuery}
    >
      <ComboboxInput placeholder="Type to filter" />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              <HighlightedMatch text={item} query={query} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export const HighlightMatch: Story = {
  render: () => <HighlightMatchCombobox />,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole("combobox"), "kit")
    const option = await screen.findByRole("option", { name: "SvelteKit" })
    await expect(option.querySelector(".font-semibold")).toHaveTextContent(
      "Kit"
    )
  },
}

function MultipleCombobox({ disabled }: { disabled?: boolean }) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      disabled={disabled}
      multiple
      items={frameworks}
      defaultValue={["Next.js", "Astro"]}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Add framework" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
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
  )
}

export const Multiple: Story = {
  render: (args) => <MultipleCombobox disabled={args.disabled} />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("combobox")

    await step("adds a chip when an option is chosen", async () => {
      await userEvent.click(input)
      await userEvent.click(await screen.findByRole("option", { name: "Nuxt" }))
      await expect(await canvas.findByText("Nuxt")).toBeVisible()
      await expect(
        screen.getByRole("option", { name: "Nuxt" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("removes the last chip with Backspace", async () => {
      await userEvent.keyboard("{Escape}")
      await userEvent.click(input)
      await userEvent.keyboard("{Backspace}")
      await waitFor(() => expect(canvas.queryByText("Nuxt")).toBeNull())
      await expect(canvas.getByText("Astro")).toBeVisible()
    })
  },
}
