import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: true,
    disabled: false,
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
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    spacing: {
      control: { type: "number", min: 0, max: 4 },
    },
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <TextBIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <TextItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <TextUnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: ["bold"] },
}

export const Outline: Story = {
  args: { variant: "outline", defaultValue: ["italic"] },
}

export const Attached: Story = {
  args: { variant: "outline", spacing: 0, defaultValue: ["bold"] },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup key={size} {...args} size={size}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <TextBIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <TextItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <TextUnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
}

export const SingleSelection: Story = {
  args: { multiple: false, variant: "outline", defaultValue: ["left"] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    variant: "outline",
    spacing: 0,
    defaultValue: ["bold"],
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["bold"] },
}
