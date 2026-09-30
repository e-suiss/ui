import type { Meta, StoryObj } from "@storybook/react-vite"

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
    <NativeSelect {...args}>
      <NativeSelectOption value="" disabled>
        Select a fruit
      </NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
      <NativeSelectOption value="grape">Grape</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Sizes: Story = {
  args: { defaultValue: "weekly" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <NativeSelect {...args} size="sm">
        <NativeSelectOption value="daily">Daily</NativeSelectOption>
        <NativeSelectOption value="weekly">Weekly</NativeSelectOption>
        <NativeSelectOption value="monthly">Monthly</NativeSelectOption>
      </NativeSelect>
      <NativeSelect {...args} size="default">
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
    <NativeSelect {...args}>
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
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}

export const Invalid: Story = {
  ...Default,
  args: { "aria-invalid": true },
}
