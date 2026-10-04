import {
  ArrowElbowDownLeftIcon,
  CommandIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  args: {
    children: "⌘K",
  },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Modifiers: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>⇧</Kbd>
      <Kbd {...args}>⌥</Kbd>
      <Kbd {...args}>⌃</Kbd>
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Tab</Kbd>
    </div>
  ),
}

export const Group: Story = {
  render: (args) => (
    <div className="text-label-secondary flex flex-col items-start gap-3 text-sm">
      <p>
        Use{" "}
        <KbdGroup>
          <Kbd {...args}>Ctrl</Kbd>
          <span>+</span>
          <Kbd {...args}>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar.
      </p>
      <KbdGroup>
        <Kbd {...args}>⌘</Kbd>
        <Kbd {...args}>⇧</Kbd>
        <Kbd {...args}>P</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd {...args}>
        <CommandIcon />K
      </Kbd>
      <Kbd {...args}>
        <ArrowElbowDownLeftIcon />
      </Kbd>
    </div>
  ),
}

export const InInputGroup: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd {...args}>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
