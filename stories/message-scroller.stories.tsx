import type { Meta, StoryObj } from "@storybook/react-vite"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const messages = [
  { id: "1", from: "them", text: "Hey, do you have a minute?" },
  { id: "2", from: "me", text: "Sure, what's up?" },
  {
    id: "3",
    from: "them",
    text: "The client moved the launch to Thursday.",
  },
  { id: "4", from: "me", text: "That's two days earlier than planned." },
  { id: "5", from: "them", text: "I know. Can we cut the onboarding tour?" },
  {
    id: "6",
    from: "me",
    text: "We could ship it behind a flag and turn it on next week.",
  },
  { id: "7", from: "them", text: "That works. What about the docs?" },
  {
    id: "8",
    from: "me",
    text: "The API reference is done. Guides need a pass.",
  },
  { id: "9", from: "them", text: "I can review the guides tonight." },
  { id: "10", from: "me", text: "Great, I'll send you the draft links." },
  { id: "11", from: "them", text: "Any blockers on the release checklist?" },
  {
    id: "12",
    from: "me",
    text: "Just the final QA run. It should finish this afternoon.",
  },
  { id: "13", from: "them", text: "Perfect. Let's sync tomorrow at ten." },
  { id: "14", from: "me", text: "Sounds good, see you then." },
]

const meta = {
  title: "Components/Message Scroller",
  component: MessageScroller,
  decorators: [
    (Story) => (
      <div className="h-96 w-96 overflow-hidden rounded-2xl border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageScroller>

export default meta

type Story = StoryObj<typeof meta>

function Messages() {
  return messages.map((message) => (
    <MessageScrollerItem key={message.id} messageId={message.id}>
      <Message align={message.from === "me" ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={message.from === "me" ? "default" : "muted"}>
            <BubbleContent>{message.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  ))
}

export const Default: Story = {
  render: (args) => (
    <MessageScrollerProvider>
      <MessageScroller {...args}>
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-3 p-4">
            <Messages />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
}

export const StartAtTop: Story = {
  render: (args) => (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller {...args}>
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-3 p-4">
            <Messages />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="start" />
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  ),
}
