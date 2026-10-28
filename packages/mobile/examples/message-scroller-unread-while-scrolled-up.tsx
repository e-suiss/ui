import { ArrowUpIcon, ChecksIcon, XIcon } from "phosphor-react-native"
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

function NewMessages({
  append,
}: {
  append: (messages: ChatMessage[]) => void
}) {
  const scroller = useMessageScroller()
  const scrollerRef = React.useRef(scroller)

  React.useEffect(() => {
    setTimeout(
      () => scrollerRef.current.scrollToMessage("m24", { animated: false }),
      300
    )
    setTimeout(
      () =>
        append([
          { id: "n1", from: "them", texts: ["Are you there?"] },
          { id: "n2", from: "them", texts: ["The build is green."] },
          { id: "n3", from: "them", texts: ["Merging now."] },
        ]),
      900
    )
  }, [append])

  return null
}

export default function MessageScrollerUnreadWhileScrolledUp() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(() =>
    longThread(40)
  )
  const append = React.useCallback((next: ChatMessage[]) => {
    setMessages((current) => [...current, ...next])
  }, [])

  return (
    <MessageScrollerProvider>
      <NewMessages append={append} />
      <View className="-m-4 flex-1">
        <MessageScroller>
          <MessageScrollerViewport
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={({ item }) => <ChatRow message={item} />}
            contentContainerClassName="gap-4 py-4"
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
