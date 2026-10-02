import { ArrowRightIcon, PlusIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" />
        New project
      </Button>
      <Button {...args} variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button {...args} size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Block: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-3">
      <Button {...args} block size="xs">
        Add to Bag
      </Button>
      <Button {...args} block size="sm">
        Add to Bag
      </Button>
      <Button {...args} block>
        Add to Bag
      </Button>
      <Button {...args} block size="lg">
        Add to Bag
      </Button>
      <Button {...args} block size="xl">
        Add to Bag
      </Button>
      <Button {...args} block variant="secondary">
        Continue
      </Button>
    </div>
  ),
}
