import type { Meta, StoryObj } from "@storybook/react-native"
import { ChecksIcon } from "phosphor-react-native"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import { Text } from "@/components/ui/text"

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
          <MessageFooter className="gap-1">
            <Icon as={ChecksIcon} className="text-accent" />
            <Text>Read 10:02 AM</Text>
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
}
