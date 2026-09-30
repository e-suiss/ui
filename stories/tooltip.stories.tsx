import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlusIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TooltipStoryArgs = React.ComponentProps<typeof Tooltip> & {
  side?: "top" | "right" | "bottom" | "left"
}

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    side: "top",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-12">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: ({ side, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent side={side}>Add to library</TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<TooltipStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-24 gap-y-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} defaultOpen>
          <TooltipTrigger render={<Button variant="outline" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Shown on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

export const WithShortcut: Story = {
  args: { defaultOpen: true },
  render: ({ side, ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger
        render={<Button variant="outline" size="icon" aria-label="New file" />}
      >
        <PlusIcon />
      </TooltipTrigger>
      <TooltipContent side={side}>
        New file
        <Kbd>⌘N</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
}
