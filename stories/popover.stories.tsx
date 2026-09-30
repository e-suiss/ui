import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-width">Width</Label>
            <Input
              id="popover-width"
              defaultValue="100%"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-height">Height</Label>
            <Input
              id="popover-height"
              defaultValue="25px"
              className="col-span-2"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}

export const Sides: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side} {...args}>
          <PopoverTrigger render={<Button variant="outline" />}>
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </PopoverTrigger>
          <PopoverContent side={side} className="w-56">
            <PopoverHeader>
              <PopoverTitle>Heads up</PopoverTitle>
              <PopoverDescription>
                This popover opens on the {side} side.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

export const Simple: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="ghost" />}>
        What is this?
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p>
          Shared links stay active for 30 days and can be revoked at any time
          from settings.
        </p>
      </PopoverContent>
    </Popover>
  ),
}
