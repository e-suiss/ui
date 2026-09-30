import { GlobeIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    items: fruits,
    disabled: false,
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fruits.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Open: Story = {
  ...Default,
  args: { defaultOpen: true, defaultValue: "banana" },
}

export const WithValue: Story = {
  ...Default,
  args: { defaultValue: "blueberry" },
}

export const Small: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

const timezones = [
  {
    label: "North America",
    items: [
      { value: "est", label: "Eastern Time" },
      { value: "cst", label: "Central Time" },
      { value: "pst", label: "Pacific Time" },
    ],
  },
  {
    label: "Europe",
    items: [
      { value: "gmt", label: "Greenwich Mean Time" },
      { value: "cet", label: "Central European Time" },
      { value: "eet", label: "Eastern European Time" },
    ],
  },
]

export const Grouped: Story = {
  args: {
    items: timezones.flatMap((group) => group.items),
    defaultValue: "cet",
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{group.label}</SelectLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  ),
}

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: GlobeIcon },
]

export const WithIcons: Story = {
  args: {
    items: themes.map(({ value, label }) => ({ value, label })),
    defaultValue: "system",
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-48" aria-invalid>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}
