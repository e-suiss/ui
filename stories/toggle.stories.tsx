import {
  BookmarkSimpleIcon,
  TextBIcon,
  TextItalicIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Toggle } from "@/components/ui/toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    "aria-label": "Toggle bold",
    children: <TextBIcon />,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} variant="default" />
      <Toggle {...args} variant="outline" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} size="sm" />
      <Toggle {...args} size="default" />
      <Toggle {...args} size="lg" />
    </div>
  ),
}

export const WithText: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} aria-label="Toggle italic">
        <TextItalicIcon data-icon="inline-start" />
        Italic
      </Toggle>
      <Toggle {...args} variant="outline" aria-label="Save for later">
        <BookmarkSimpleIcon data-icon="inline-start" />
        Save
      </Toggle>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
