import { CalendarBlankIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const meta = {
  title: "Components/Hover Card",
  component: HoverCard,
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger
        href="#"
        render={<Button variant="link" nativeButton={false} />}
      >
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar size="lg">
            <AvatarImage src="https://github.com/vercel.png" alt="@nextjs" />
            <AvatarFallback>NJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React framework, created and maintained by @vercel.
            </p>
            <div className="text-label-secondary mt-1 flex items-center gap-1.5 text-xs">
              <CalendarBlankIcon />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
}

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3 p-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverCard key={side} {...args}>
          <HoverCardTrigger
            href="#"
            render={<Button variant="outline" nativeButton={false} />}
          >
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-56">
            <p className="text-sm">
              This card opens on the {side} side of its trigger.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
}
