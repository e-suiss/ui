// @ts-nocheck
import { GlobeIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

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
      <SelectTrigger aria-label="Fruit" className="w-48">
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
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("opens the list and picks an option", async () => {
      await expect(trigger).toHaveTextContent("Select a fruit")
      await userEvent.click(trigger)
      await screen.findByRole("listbox")
      await userEvent.click(
        await screen.findByRole("option", { name: "Banana" })
      )
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("Banana")
      await expect(trigger).toHaveFocus()
    })

    await step("marks the chosen option as selected", async () => {
      await userEvent.click(trigger)
      await expect(
        await screen.findByRole("option", { name: "Banana" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("closes with Escape and keeps the value", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveFocus()
      await expect(trigger).toHaveTextContent("Banana")
    })
  },
}

export const Open: Story = {
  args: { defaultOpen: true, defaultValue: "banana" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("opens on mount with the value selected", async () => {
      await expect(
        await screen.findByRole("option", { name: "Banana" })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("picks another option from the keyboard", async () => {
      await waitFor(() =>
        expect(screen.getByRole("option", { name: "Banana" })).toHaveFocus()
      )
      await userEvent.keyboard("{ArrowDown}{Enter}")
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toHaveTextContent("Blueberry")
    })
  },
}

export const WithValue: Story = {
  args: { defaultValue: "blueberry" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("shows the default value's label", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toHaveTextContent("Blueberry")
    })
  },
}

export const Small: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Fruit" size="sm" className="w-40">
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
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("opens the list and picks an option", async () => {
      await expect(trigger).toHaveAttribute("data-size", "sm")
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("option", { name: "Grapes" })
      )
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("Grapes")
    })
  },
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
      <SelectTrigger aria-label="Timezone" className="w-60">
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
  play: async ({ canvas, step }) => {
    await step("labels each group of options", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Timezone" })
      ).toHaveTextContent("Central European Time")
      await userEvent.click(canvas.getByRole("combobox", { name: "Timezone" }))
      const europe = await screen.findByRole("group", { name: "Europe" })
      await expect(within(europe).getAllByRole("option")).toHaveLength(3)
      await expect(
        screen.getByRole("group", { name: "North America" })
      ).toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    })
  },
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
      <SelectTrigger aria-label="Theme" className="w-40">
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
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Theme" })

    await step("shows the default value", async () => {
      await expect(trigger).toHaveTextContent("System")
    })

    await step("opens the list and picks an option", async () => {
      await userEvent.click(trigger)
      const dark = await screen.findByRole("option", { name: "Dark" })
      await expect(dark.querySelector("svg")).toBeInTheDocument()
      await userEvent.click(dark)
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("Dark")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })

    await step("does not open while disabled", async () => {
      await expect(trigger).toHaveAttribute("data-disabled")
      await userEvent.click(trigger, { pointerEventsCheck: 0 })
      await expect(screen.queryByRole("listbox")).toBeNull()
    })
  },
}

export const Invalid: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Fruit" className="w-48" aria-invalid>
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
  play: async ({ canvas, step }) => {
    await step("flags the trigger as invalid", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toHaveAttribute("aria-invalid", "true")
    })
  },
}
