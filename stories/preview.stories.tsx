import { CalendarBlankIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Preview,
  PreviewContent,
  PreviewTrigger,
} from "@/components/patterns/preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function ProfileCard() {
  return (
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
        <div className="mt-1 flex items-center gap-1.5 text-xs text-label-secondary">
          <CalendarBlankIcon />
          Joined December 2021
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "Patterns/Preview",
  component: Preview,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Preview {...args}>
      <PreviewTrigger href="#">@nextjs</PreviewTrigger>
      <PreviewContent>
        <ProfileCard />
      </PreviewContent>
    </Preview>
  ),
} satisfies Meta<typeof Preview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
}

export const WithCloseButton: Story = {
  render: (args) => (
    <Preview {...args}>
      <PreviewTrigger href="#">@nextjs</PreviewTrigger>
      <PreviewContent showCloseButton>
        <ProfileCard />
      </PreviewContent>
    </Preview>
  ),
}

export const WithCloseLabel: Story = {
  render: (args) => (
    <Preview {...args}>
      <PreviewTrigger href="#">@nextjs</PreviewTrigger>
      <PreviewContent showCloseButton closeLabel="Done">
        <ProfileCard />
      </PreviewContent>
    </Preview>
  ),
}

export const Attached: Story = {
  args: { floating: false },
}
