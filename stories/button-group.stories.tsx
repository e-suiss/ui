import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CaretDownIcon,
  CopyIcon,
  LinkIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">
        <CopyIcon data-icon="inline-start" />
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
    </ButtonGroup>
  ),
}

export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Publish</Button>
      <ButtonGroupSeparator className="bg-primary-foreground/30" />
      <Button size="icon" aria-label="More options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>
        <LinkIcon />
        https://
      </ButtonGroupText>
      <input
        aria-label="Website"
        placeholder="example.com"
        className="h-9 min-w-0 rounded-4xl border bg-transparent px-3 text-sm outline-none"
      />
      <Button variant="outline">Save</Button>
    </ButtonGroup>
  ),
}

export const Nested: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}
