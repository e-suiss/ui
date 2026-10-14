import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArrowUpIcon,
  ChatsCircleIcon,
  ChecksIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

type ChatMessage = {
  id: string
  from: "me" | "them"
  texts: string[]
  time?: string
  status?: string
  reaction?: string
  attachment?: { name: string; size: string; progress?: number }
}

const thread: ChatMessage[] = [
  {
    id: "1",
    from: "them",
    texts: ["Hey, do you have a minute?", "The client moved the launch."],
    time: "9:12 AM",
  },
  { id: "2", from: "me", texts: ["Sure, what's up?"] },
  {
    id: "3",
    from: "them",
    texts: ["It's Thursday now. Two days earlier than planned."],
    reaction: "😬 1",
  },
  {
    id: "4",
    from: "me",
    texts: [
      "We could ship onboarding behind a flag.",
      "Turn it on next week once QA is done.",
    ],
    status: "Read 9:15 AM",
  },
  {
    id: "5",
    from: "them",
    texts: ["Here are the release notes."],
    attachment: { name: "Release notes.pdf", size: "1.2 MB" },
    time: "9:18 AM",
  },
  {
    id: "6",
    from: "me",
    texts: ["And the checklist with my comments."],
    attachment: { name: "Checklist.pdf", size: "Uploading", progress: 64 },
  },
  {
    id: "7",
    from: "them",
    texts: ["Perfect. Let's sync tomorrow at ten."],
    reaction: "👍 2",
  },
  {
    id: "8",
    from: "me",
    texts: ["Sounds good, see you then."],
    status: "Delivered",
  },
]

const subjects = [
  "Did you see the latest build?",
  "The onboarding copy needs one more pass.",
  "I can take the release notes.",
  "QA found two small issues on Android.",
  "Both are fixed in the next build.",
  "Can we move the review to the afternoon?",
]

function longThread(count: number, offset = 0): ChatMessage[] {
  return Array.from({ length: count }, (_, index) => {
    const number = index + offset
    return {
      id: `m${number}`,
      from: number % 3 === 0 ? "me" : "them",
      texts: [subjects[number % subjects.length]],
    }
  })
}

function ChatRow({ message }: { message: ChatMessage }) {
  const mine = message.from === "me"
  return (
    <MessageScrollerItem>
      <Message align={mine ? "end" : "start"}>
        {mine ? null : (
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
          </MessageAvatar>
        )}
        <MessageContent>
          {message.time && !mine ? (
            <MessageHeader>Maya · {message.time}</MessageHeader>
          ) : null}
          {message.attachment ? (
            <Attachment
              state={message.attachment.progress ? "uploading" : "done"}
              className="w-64"
            >
              <AttachmentMedia variant="document">
                <AttachmentLabel className="bg-red">pdf</AttachmentLabel>
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{message.attachment.name}</AttachmentTitle>
                {message.attachment.progress ? (
                  <AttachmentProgress
                    value={message.attachment.progress}
                    accessibilityLabel="Uploading"
                  />
                ) : (
                  <AttachmentDescription>
                    {message.attachment.size}
                  </AttachmentDescription>
                )}
              </AttachmentContent>
              {message.attachment.progress ? (
                <AttachmentActions>
                  <AttachmentAction accessibilityLabel="Cancel upload">
                    <Icon as={XIcon} />
                  </AttachmentAction>
                </AttachmentActions>
              ) : null}
            </Attachment>
          ) : null}
          {message.texts.map((text, index) => (
            <Bubble key={text} variant={mine ? "default" : "muted"}>
              <BubbleContent>{text}</BubbleContent>
              {message.reaction && index === message.texts.length - 1 ? (
                <BubbleReactions align={mine ? "start" : "end"}>
                  {message.reaction}
                </BubbleReactions>
              ) : null}
            </Bubble>
          ))}
          {message.status ? (
            <MessageFooter className="gap-1">
              <Icon as={ChecksIcon} className="text-accent" />
              <Text>{message.status}</Text>
            </MessageFooter>
          ) : null}
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = React.useState("")
  const { scrollToEnd } = useMessageScroller()
  const send = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue("")
    requestAnimationFrame(() => scrollToEnd())
  }
  return (
    <BottomBar separator>
      <BottomBarContent>
        <InputGroup>
          <InputGroupInput
            placeholder="Message"
            value={value}
            onValueChange={setValue}
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="default"
              size="icon-xs"
              accessibilityLabel="Send"
              disabled={!value.trim()}
              onPress={send}
            >
              <Icon as={ArrowUpIcon} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </BottomBarContent>
    </BottomBar>
  )
}

type ChatReady = (
  append: (messages: ChatMessage[]) => void,
  scroller: ReturnType<typeof useMessageScroller>
) => void

function ReadyEffect({
  append,
  onReady,
}: {
  append: (messages: ChatMessage[]) => void
  onReady?: ChatReady
}) {
  const scroller = useMessageScroller()
  const readyRef = React.useRef(onReady)
  const scrollerRef = React.useRef(scroller)

  React.useEffect(() => {
    readyRef.current?.(append, scrollerRef.current)
  }, [append])

  return null
}

function Chat({
  initial,
  empty,
  onReady,
}: {
  initial: ChatMessage[]
  empty?: React.ReactElement
  onReady?: ChatReady
}) {
  const [messages, setMessages] = React.useState(initial)
  const append = React.useCallback((next: ChatMessage[]) => {
    setMessages((current) => [...current, ...next])
  }, [])

  return (
    <MessageScrollerProvider>
      <ReadyEffect append={append} onReady={onReady} />
      <View className="-m-4 flex-1">
        <MessageScroller>
          <MessageScrollerViewport
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={({ item }) => <ChatRow message={item} />}
            contentContainerClassName="gap-4 py-4"
            ListEmptyComponent={empty}
          />
          <MessageScrollerButton />
        </MessageScroller>
        <Composer
          onSend={(text) =>
            append([{ id: `sent-${Date.now()}`, from: "me", texts: [text] }])
          }
        />
      </View>
    </MessageScrollerProvider>
  )
}

const meta = {
  title: "Components/Message Scroller",
  component: MessageScroller,
} satisfies Meta<typeof MessageScroller>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Chat initial={thread} />,
}

export const UnreadWhileScrolledUp: Story = {
  render: () => (
    <Chat
      initial={longThread(40)}
      onReady={(append, scroller) => {
        setTimeout(() => scroller.scrollToStart({ animated: false }), 300)
        setTimeout(
          () =>
            append([
              { id: "n1", from: "them", texts: ["Are you there?"] },
              { id: "n2", from: "them", texts: ["The build is green."] },
              { id: "n3", from: "them", texts: ["Merging now."] },
            ]),
          900
        )
      }}
    />
  ),
}

export const EmptyThread: Story = {
  render: () => (
    <Chat
      initial={[]}
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon as={ChatsCircleIcon} />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>
              Say hello to start the conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  ),
}

function LoadOlderDemo() {
  const [messages, setMessages] = React.useState(() => longThread(15, 45))
  const [loading, setLoading] = React.useState(false)
  const oldest = Number(messages[0]?.id.slice(1) ?? 0)
  const loadOlder = () => {
    if (loading || oldest <= 0) return
    setLoading(true)
    setTimeout(() => {
      setMessages((current) => [
        ...longThread(Math.min(15, oldest), Math.max(0, oldest - 15)),
        ...current,
      ])
      setLoading(false)
    }, 800)
  }
  return (
    <MessageScrollerProvider>
      <View className="-m-4 flex-1">
        <MessageScroller>
          <MessageScrollerViewport
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={({ item }) => <ChatRow message={item} />}
            contentContainerClassName="gap-4 py-4"
            onLoadOlder={loadOlder}
            ListFooterComponent={
              loading ? (
                <View className="items-center py-2">
                  <Spinner />
                </View>
              ) : null
            }
          />
          <MessageScrollerButton />
        </MessageScroller>
      </View>
    </MessageScrollerProvider>
  )
}

export const LoadOlder: Story = {
  render: () => <LoadOlderDemo />,
}
