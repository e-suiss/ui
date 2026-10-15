import {
  ArrowUpIcon,
  InfoIcon,
  NotePencilIcon,
  PlusIcon,
  TrashIcon,
  VideoCameraIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
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
import {
  fontSize,
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

type Line = { id: string; from: "me" | "them"; text: string }

type Tint = Tone

type Thread = { name: string; tint: Tint; time: string; lines: Line[] }

type Row =
  | { id: string; kind: "stamp" }
  | { id: string; kind: "typing" }
  | ({ kind: "line" } & Line)

const THREADS: { name: string; tint: Tint; time: string; lines: string[] }[] = [
  {
    name: "Riley Chen",
    tint: "green500",
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
    tint: "orange500",
    time: "8:12 AM",
    lines: [
      "them:I sent the deck, can you take a look?",
      "me:On it, back to you in 10 minutes",
    ],
  },
  {
    name: "Family",
    tint: "purple500",
    time: "Yesterday",
    lines: [
      "them:Is everyone coming for Sunday brunch?",
      "me:We'll be there",
      "them:I'll bring pastries",
    ],
  },
  {
    name: "Taylor Kim",
    tint: "blue500",
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

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: radius.full },
  dots: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  group: { flex: 1, height: 36, borderRadius: radius.full },
  input: { paddingStart: 14 },
  addon: { paddingEnd: 4 },
  send: { width: 27, height: 27 },
  header: { height: 56, borderBottomWidth: 1 },
  title: { flexDirection: "row", alignItems: "center", gap: 10 },
  titleText: { flexShrink: 1 },
  list: { gap: 4, paddingHorizontal: 10, paddingVertical: 16 },
  stamp: {
    ...fontSize["2xs"],
    marginTop: 4,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rowText: { flex: 1, gap: 2 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { ...fontSize.base, flex: 1, fontWeight: "600" },
  separator: { height: 1, marginStart: 72 },
  empty: {
    ...fontSize.base,
    paddingHorizontal: 16,
    paddingTop: 40,
    textAlign: "center",
  },
})

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
  const { colors } = useTheme()
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
      style={[
        styles.dot,
        { backgroundColor: colors.mutedForeground },
        animatedStyle,
      ]}
    />
  )
}

function TypingDots() {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted" accessible accessibilityLabel="Typing">
          <BubbleContent style={styles.dots}>
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
  const { colors } = useTheme()
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
      <BottomBarContent style={styles.composer}>
        <Button
          variant="secondary"
          size="icon-sm"
          accessibilityLabel="Add attachment"
          onPress={onAttach}
        >
          <Icon
            as={PlusIcon}
            weight="bold"
            size={18}
            color={colors.mutedForeground}
          />
        </Button>
        <InputGroup style={styles.group}>
          <InputGroupInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            accessibilityLabel={placeholder}
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={send}
            style={styles.input}
          />
          <InputGroupAddon align="inline-end" style={styles.addon}>
            <AnimatedView style={sendStyle}>
              <InputGroupButton
                variant="default"
                size="icon-xs"
                accessibilityLabel="Send"
                disabled={!ready}
                onPress={send}
                style={styles.send}
              >
                <Icon as={ArrowUpIcon} weight="bold" size={16} />
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

function ThreadAvatar({ thread, size }: { thread: Thread; size: number }) {
  const { colors } = useTheme()
  return (
    <Avatar size="lg" style={{ width: size, height: size }}>
      <AvatarFallback style={{ backgroundColor: tone(colors, thread.tint) }}>
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
  const { colors } = useTheme()
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
          <Header style={[styles.header, { borderBottomColor: colors.border }]}>
            <HeaderBack onPress={() => setSelected(null)}>Messages</HeaderBack>
            <HeaderTitle style={styles.title}>
              <ThreadAvatar thread={thread} size={30} />
              <View style={styles.titleText}>
                <Text
                  numberOfLines={1}
                  style={[fontSize.sm, { fontWeight: "600" }]}
                >
                  {thread.name}
                </Text>
                <Text
                  accessibilityLiveRegion="polite"
                  style={[fontSize["2xs"], { color: colors.mutedForeground }]}
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
                <Icon as={VideoCameraIcon} size={20} color={colors.primary} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel="Details"
                onPress={() => onDetails?.(thread.name)}
              >
                <Icon as={InfoIcon} size={20} color={colors.primary} />
              </Button>
            </HeaderActions>
          </Header>
          <MessageScroller>
            <MessageScrollerViewport
              data={rows}
              keyExtractor={(row) => row.id}
              accessibilityLabel={`Conversation with ${thread.name}`}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <MessageScrollerItem>
                  {item.kind === "stamp" ? (
                    <Text
                      style={[styles.stamp, { color: colors.mutedForeground }]}
                    >
                      Today 9:30 AM
                    </Text>
                  ) : null}
                  {item.kind === "typing" ? <TypingDots /> : null}
                  {item.kind === "line" ? <LineRow line={item} /> : null}
                </MessageScrollerItem>
              )}
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
            <Icon as={NotePencilIcon} size={20} color={colors.primary} />
          </Button>
        </HeaderActions>
      </Header>
      <HeaderScrollView scroll={scroll}>
        <HeaderLargeTitle>Messages</HeaderLargeTitle>
        {threads.length === 0 ? (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            No Messages
          </Text>
        ) : null}
        {threads.map((item, index) => {
          const last = item.lines.at(-1)
          return (
            <React.Fragment key={item.name}>
              {index > 0 ? (
                <View
                  style={[styles.separator, { backgroundColor: colors.border }]}
                />
              ) : null}
              <SwipeActions>
                <SwipeActionsContent>
                  <Pressable
                    role="button"
                    onPress={() => setSelected(item.name)}
                    style={({ pressed }) => [
                      styles.row,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <ThreadAvatar thread={item} size={44} />
                    <View style={styles.rowText}>
                      <View style={styles.rowTop}>
                        <Text numberOfLines={1} style={styles.name}>
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            fontSize.sm,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {item.time}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[fontSize.sm, { color: colors.mutedForeground }]}
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
        <View style={{ height: 32 }} />
      </HeaderScrollView>
    </Screen>
  )
}

export { ChatConversations }
