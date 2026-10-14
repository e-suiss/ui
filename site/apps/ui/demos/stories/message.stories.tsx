// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

const meta = {
  title: "Components/Message",
  component: Message,
  args: {
    align: "start",
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Message>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Message {...args}>
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>Are we still on for lunch tomorrow?</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
  play: async ({ canvas, step }) => {
    await step("shows the avatar and the message text", async () => {
      await expect(canvas.getByText("MK")).toBeVisible()
      await expect(
        canvas.getByText("Are we still on for lunch tomorrow?")
      ).toBeVisible()
    })
  },
}

export const AlignEnd: Story = {
  args: { align: "end" },
  render: (args) => (
    <Message {...args}>
      <MessageContent>
        <Bubble>
          <BubbleContent>Yes, see you at noon.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
  play: async ({ canvasElement, step }) => {
    await step("aligns the message to the end", async () => {
      await expect(
        canvasElement.querySelector('[data-slot="message"]')
      ).toHaveAttribute("data-align", "end")
    })
  },
}

export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <Message {...args}>
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Jordan Lee</MessageHeader>
        <Bubble variant="muted">
          <BubbleContent>
            I pushed the updated designs to the shared folder.
          </BubbleContent>
        </Bubble>
        <MessageFooter>9:41 AM</MessageFooter>
      </MessageContent>
    </Message>
  ),
  play: async ({ canvas, step }) => {
    await step("shows the sender and timestamp", async () => {
      await expect(canvas.getByText("Jordan Lee")).toBeVisible()
      await expect(canvas.getByText("9:41 AM")).toBeVisible()
    })
  },
}

export const Conversation: Story = {
  render: () => (
    <MessageGroup className="gap-4">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Did the build pass?</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>I want to ship before the weekend.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>All green. Merging it now.</BubbleContent>
          </Bubble>
          <MessageFooter>Read 10:02 AM</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
}
