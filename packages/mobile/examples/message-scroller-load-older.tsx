import { ChecksIcon, XIcon } from "phosphor-react-native"
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
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
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
                <AttachmentLabel className="bg-red-500">pdf</AttachmentLabel>
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
              <Icon as={ChecksIcon} className="text-primary" />
              <Text>{message.status}</Text>
            </MessageFooter>
          ) : null}
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
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

export default function MessageScrollerLoadOlder() {
  return <LoadOlderDemo />
}
