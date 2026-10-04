import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
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
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}

export const Grouped: Story = {
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
}
