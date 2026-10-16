import {
  ArrowUpIcon,
  InfoIcon,
  NotePencilIcon,
  PlusIcon,
  TrashIcon,
  VideoCameraIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import {
  cancelAnimation,
  Easing,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderActions,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

type Line = { id: string; from: "me" | "them"; text: string }

type Thread = { name: string; tint: string; time: string; lines: Line[] }

type Row =
  | { id: string; kind: "stamp" }
  | { id: string; kind: "typing" }
  | ({ kind: "line" } & Line)

const THREADS: { name: string; tint: string; time: string; lines: string[] }[] =
  [
    {
      name: "Riley Chen",
      tint: "bg-green-500",
      time: "9:41 AM",
      lines: [
        "them:Is the weekend trip to the coast still on?",
        "me:Yes! We leave Friday evening",
        "me:I booked the boat tour, it leaves at 5 AM",
        "them:Great, I'll bring the camera",
      ],
    },
    {
      name: "Morgan Lee",
      tint: "bg-orange-500",
      time: "8:12 AM",
      lines: [
        "them:I sent the deck, can you take a look?",
        "me:On it, back to you in 10 minutes",
      ],
    },
    {
      name: "Family",
      tint: "bg-purple-500",
      time: "Yesterday",
      lines: [
        "them:Is everyone coming for Sunday brunch?",
        "me:We'll be there",
        "them:I'll bring pastries",
      ],
    },
    {
      name: "Taylor Kim",
      tint: "bg-blue-500",
      time: "Monday",
      lines: ["them:What time does the game start?"],
    },
  ]

const REPLIES = [
  "Sounds good",
  "Great, see you then!",
  "Ha, absolutely",
  "Let me check and get back to you",
]

const SEND_EASING = Easing.bezier(0.3, 1.25, 0.5, 1)

const initialThreads = (): Thread[] =>
  THREADS.map((thread, index) => ({
    name: thread.name,
    tint: thread.tint,
    time: thread.time,
    lines: thread.lines.map((line, position) => {
      const [from, ...text] = line.split(":")
      return {
        id: `${index}-${position}`,
        from: from as Line["from"],
        text: text.join(":"),
      }
    }),
  }))

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

function TypingDot({ index }: { index: number }) {
  const opacity = useSharedValue(0.35)

  React.useEffect(() => {
    opacity.value = withDelay(
      index * 180,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 550 }),
          withTiming(0.35, { duration: 550 })
        ),
        -1,
        false,
        undefined,
        ReduceMotion.System
      )
    )
    return () => cancelAnimation(opacity)
  }, [index, opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <AnimatedView
      className="size-2 rounded-full bg-muted-foreground"
      style={animatedStyle}
    />
  )
}

function TypingDots() {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted" accessible accessibilityLabel="Typing">
          <BubbleContent className="flex-row gap-1 px-3.5 py-3">
            {[0, 1, 2].map((dot) => (
              <TypingDot key={dot} index={dot} />
            ))}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function Composer({
  placeholder,
  onSend,
  onAttach,
}: {
  placeholder: string
  onSend: (text: string) => void
  onAttach?: () => void
}) {
  const [value, setValue] = React.useState("")
  const { scrollToEnd } = useMessageScroller()
  const ready = value.trim().length > 0
  const scale = useSharedValue(ready ? 1 : 0)

  React.useEffect(() => {
    scale.value = withTiming(ready ? 1 : 0, {
      duration: 300,
      easing: SEND_EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [ready, scale])

  const sendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const send = () => {
    if (!ready) return
    onSend(value.trim())
    setValue("")
    requestAnimationFrame(() => scrollToEnd())
  }

  return (
    <BottomBar separator>
      <BottomBarContent className="flex-row items-center gap-2 px-4 pt-2.5 pb-3.5">
        <Button
          variant="secondary"
          size="icon-sm"
          accessibilityLabel="Add attachment"
          onPress={onAttach}
        >
          <Icon
            as={PlusIcon}
            weight="bold"
            className="size-[1.125rem] text-muted-foreground"
          />
        </Button>
        <InputGroup className="h-9 flex-1 rounded-full">
          <InputGroupInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            accessibilityLabel={placeholder}
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={send}
            className="ps-3.5"
          />
          <InputGroupAddon align="inline-end" className="pe-1">
            <AnimatedView style={sendStyle}>
              <InputGroupButton
                variant="default"
                size="icon-xs"
                accessibilityLabel="Send"
                disabled={!ready}
                onPress={send}
                className="size-[1.6875rem]"
              >
                <Icon as={ArrowUpIcon} weight="bold" className="size-4" />
              </InputGroupButton>
            </AnimatedView>
          </InputGroupAddon>
        </InputGroup>
      </BottomBarContent>
    </BottomBar>
  )
}

function LineRow({ line }: { line: Line }) {
  const mine = line.from === "me"
  return (
    <AnimatedView
      entering={FadeInDown.duration(700)
        .easing(Easing.bezier(0.32, 0.72, 0, 1))
        .reduceMotion(ReduceMotion.System)}
    >
      <Message align={mine ? "end" : "start"}>
        <MessageContent>
          <Bubble
            variant={mine ? "default" : "muted"}
            align={mine ? "end" : "start"}
          >
            <BubbleContent>{line.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </AnimatedView>
  )
}

function ThreadAvatar({
  thread,
  className,
}: {
  thread: Thread
  className?: string
}) {
  return (
    <Avatar size="lg" className={className}>
      <AvatarFallback className={thread.tint}>
        {initials(thread.name)}
      </AvatarFallback>
    </Avatar>
  )
}

function ChatConversations({
  onSend,
  onNewMessage,
  onAttach,
  onVideoCall,
  onDetails,
  onDelete,
}: {
  onSend?: (text: string, conversation: string) => void
  onNewMessage?: () => void
  onAttach?: () => void
  onVideoCall?: (conversation: string) => void
  onDetails?: (conversation: string) => void
  onDelete?: (conversation: string) => void
}) {
  const [threads, setThreads] = React.useState(initialThreads)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [typing, setTyping] = React.useState<string | null>(null)
  const replyCount = React.useRef(0)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const scroll = useHeaderScroll()
  const thread = threads.find((item) => item.name === selected)

  React.useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer)
    },
    []
  )

  const append = (name: string, from: Line["from"], text: string) =>
    setThreads((current) =>
      current.map((item) =>
        item.name === name
          ? {
              ...item,
              lines: [
                ...item.lines,
                { id: `${name}-${item.lines.length}`, from, text },
              ],
            }
          : item
      )
    )

  const send = (text: string) => {
    if (!thread) return
    const target = thread.name
    onSend?.(text, target)
    append(target, "me", text)
    timers.current.push(setTimeout(() => setTyping(target), 500))
    timers.current.push(
      setTimeout(() => {
        const reply =
          REPLIES[replyCount.current++ % REPLIES.length] ?? REPLIES[0]
        setTyping(null)
        append(target, "them", reply)
      }, 1800)
    )
  }

  if (thread) {
    const rows: Row[] = [
      { id: "stamp", kind: "stamp" },
      ...thread.lines.map((line) => ({ kind: "line" as const, ...line })),
      ...(typing === thread.name
        ? [{ id: "typing", kind: "typing" as const }]
        : []),
    ]
    return (
      <Screen edges={["top", "right", "left"]}>
        <MessageScrollerProvider key={thread.name}>
          <Header className="h-14 border-b border-border">
            <HeaderBack onPress={() => setSelected(null)}>Messages</HeaderBack>
            <HeaderTitle className="flex-row items-center gap-2.5">
              <ThreadAvatar thread={thread} className="size-[1.875rem]" />
              <View className="shrink">
                <Text numberOfLines={1} className="text-sm font-semibold">
                  {thread.name}
                </Text>
                <Text
                  accessibilityLiveRegion="polite"
                  className="text-xs text-muted-foreground"
                >
                  {typing === thread.name ? "typing…" : "Message"}
                </Text>
              </View>
            </HeaderTitle>
            <HeaderActions>
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel="Video call"
                onPress={() => onVideoCall?.(thread.name)}
              >
                <Icon as={VideoCameraIcon} className="size-5 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel="Details"
                onPress={() => onDetails?.(thread.name)}
              >
                <Icon as={InfoIcon} className="size-5 text-primary" />
              </Button>
            </HeaderActions>
          </Header>
          <MessageScroller>
            <MessageScrollerViewport
              data={rows}
              keyExtractor={(row) => row.id}
              accessibilityLabel={`Conversation with ${thread.name}`}
              contentContainerClassName="gap-1 px-2.5 py-4"
              renderItem={({ item }) => {
                if (item.kind === "stamp") {
                  return (
                    <MessageScrollerItem>
                      <Text className="mt-1 mb-2.5 text-center text-xs text-muted-foreground">
                        Today 9:30 AM
                      </Text>
                    </MessageScrollerItem>
                  )
                }
                return (
                  <MessageScrollerItem>
                    {item.kind === "typing" ? (
                      <TypingDots />
                    ) : (
                      <LineRow line={item} />
                    )}
                  </MessageScrollerItem>
                )
              }}
            />
          </MessageScroller>
          <Composer placeholder="Message" onSend={send} onAttach={onAttach} />
        </MessageScrollerProvider>
      </Screen>
    )
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      <Header scroll={scroll}>
        <HeaderTitle>Messages</HeaderTitle>
        <HeaderActions>
          <Button
            variant="ghost"
            size="icon"
            accessibilityLabel="New message"
            onPress={onNewMessage}
          >
            <Icon as={NotePencilIcon} className="size-5 text-primary" />
          </Button>
        </HeaderActions>
      </Header>
      <HeaderScrollView scroll={scroll}>
        <HeaderLargeTitle>Messages</HeaderLargeTitle>
        {threads.length === 0 ? (
          <Text className="px-4 pt-10 text-center text-base text-muted-foreground">
            No Messages
          </Text>
        ) : null}
        {threads.map((item, index) => {
          const last = item.lines.at(-1)
          return (
            <React.Fragment key={item.name}>
              {index > 0 ? (
                <View className="ms-[4.5rem] h-px bg-border" />
              ) : null}
              <SwipeActions>
                <SwipeActionsContent>
                  <Pressable
                    role="button"
                    onPress={() => setSelected(item.name)}
                    className="flex-row items-center gap-3 px-4 py-2.5 active:opacity-80"
                  >
                    <ThreadAvatar thread={item} className="size-11" />
                    <View className="flex-1 gap-0.5">
                      <View className="flex-row items-center gap-1.5">
                        <Text
                          numberOfLines={1}
                          className="flex-1 text-base font-semibold"
                        >
                          {item.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {item.time}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-sm text-muted-foreground"
                      >
                        {last?.text}
                      </Text>
                    </View>
                  </Pressable>
                </SwipeActionsContent>
                <SwipeActionsActions side="trailing">
                  <SwipeAction
                    variant="destructive"
                    fullSwipe
                    onPress={() => {
                      onDelete?.(item.name)
                      setThreads((current) =>
                        current.filter((entry) => entry.name !== item.name)
                      )
                    }}
                  >
                    <Icon as={TrashIcon} />
                    <Text>Delete</Text>
                  </SwipeAction>
                </SwipeActionsActions>
              </SwipeActions>
            </React.Fragment>
          )
        })}
        <View className="h-8" />
      </HeaderScrollView>
    </Screen>
  )
}

export { ChatConversations }
