import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"
import { Text } from "@/components/ui/text"

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
    accessibilityLabel: "Framework",
    className: "w-56",
  },
} satisfies Meta<typeof SearchPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: "astro" },
}

export const Grouped: Story = {
  args: {
    items: cities,
    placeholder: "Select a city",
    searchPlaceholder: "Search cities...",
    emptyText: "No city found.",
    accessibilityLabel: "City",
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
}

export const Invalid: Story = {
  args: { invalid: true },
}

function ControlledExample(args: React.ComponentProps<typeof SearchPicker>) {
  const [value, setValue] = React.useState<string | null>("next")

  return (
    <View className="items-start gap-2">
      <SearchPicker {...args} value={value} onValueChange={setValue} />
      <Text className="text-sm text-label-secondary">
        Selected: {value ?? "none"}
      </Text>
    </View>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
}

export const Floating: Story = {
  args: { floating: true },
}
