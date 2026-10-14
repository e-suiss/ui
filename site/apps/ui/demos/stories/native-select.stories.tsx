// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

const meta = {
  title: "Components/Native Select",
  component: NativeSelect,
  args: {
    size: "default",
    disabled: false,
    defaultValue: "",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args} aria-label="Fruit">
      <NativeSelectOption value="" disabled>
        Select a fruit
      </NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
      <NativeSelectOption value="grape">Grape</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvas, step }) => {
    const select = canvas.getByRole("combobox", { name: "Fruit" })

    await step("starts on the disabled placeholder", async () => {
      await expect(select).toHaveValue("")
      await expect(
        canvas.getByRole("option", { name: "Select a fruit" })
      ).toBeDisabled()
    })

    await step("selects an option", async () => {
      await userEvent.selectOptions(select, "banana")
      await expect(select).toHaveValue("banana")
      await expect(
        canvas.getByRole<HTMLOptionElement>("option", { name: "Banana" })
          .selected
      ).toBe(true)
    })
  },
}

export const Sizes: Story = {
  args: { defaultValue: "weekly" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <NativeSelect {...args} size="sm" aria-label="Frequency">
        <NativeSelectOption value="daily">Daily</NativeSelectOption>
        <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
        <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      </NativeSelect>
      <NativeSelect {...args} size="default" aria-label="Frequency">
        <NativeSelectOption value="daily">Daily</NativeSelectOption>
        <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
        <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const WithGroups: Story = {
  args: { defaultValue: "berlin" },
  render: (args) => (
    <NativeSelect {...args} aria-label="City">
      <NativeSelectOptGroup label="Europe">
        <NativeSelectOption value="berlin">Berlin</NativeSelectOption>
        <NativeSelectOption value="lisbon">Lisbon</NativeSelectOption>
        <NativeSelectOption value="zurich">Zurich</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Asia">
        <NativeSelectOption value="seoul">Seoul</NativeSelectOption>
        <NativeSelectOption value="singapore">Singapore</NativeSelectOption>
        <NativeSelectOption value="tokyo">Tokyo</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
  play: async ({ canvas, step }) => {
    await step("groups options and selects across groups", async () => {
      await expect(canvas.getByRole("group", { name: "Asia" })).toBeTruthy()
      const select = canvas.getByRole("combobox", { name: "City" })
      await userEvent.selectOptions(select, "seoul")
      await expect(select).toHaveValue("seoul")
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("disables the select", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toBeDisabled()
    })
  },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("flags the select as invalid", async () => {
      await expect(
        canvas.getByRole("combobox", { name: "Fruit" })
      ).toBeInvalid()
    })
  },
}
