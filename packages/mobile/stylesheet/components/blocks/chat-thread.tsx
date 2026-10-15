import {
  ArrowUpIcon,
  CaretRightIcon,
  HeartIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Image, Pressable, StyleSheet, View } from "react-native"
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
  ZoomIn,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
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
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"

type Photo = { name: string; size: string; image: string }

type Line = {
  id: string
  from: "me" | "them"
  text?: string
  photo?: Photo
  liked?: boolean
}

type Row =
  | { id: string; kind: "stamp" }
  | { id: string; kind: "typing" }
  | ({ kind: "line" } & Line)

const PHOTO: Photo = {
  name: "IMG_0142.jpeg",
  size: "1.8 MB",
  image:
    "https://images.unsplash.com/photo-1714972384975-fbd4f19b1bb3?w=200&q=80&auto=format&fit=crop",
}

const OPENING: Line[] = [
  { id: "0", from: "them", text: "Is the weekend trip to the coast still on?" },
  { id: "1", from: "me", text: "Yes! We leave Friday evening" },
  { id: "2", from: "me", text: "I booked the boat tour, it leaves at 5 AM" },
  { id: "3", from: "them", text: "Great, I'll bring the camera" },
]

const REPLIES = [
  "Sounds good",
  "Great, see you then!",
  "Ha, absolutely",
  "Let me check and get back to you",
]

const DOUBLE_TAP = 300

const SEND_EASING = Easing.bezier(0.3, 1.25, 0.5, 1)

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: radius.full },
  dots: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  attachment: { width: 224 },
  image: { width: "100%", height: "100%" },
  composer: { gap: 8, paddingHorizontal: 10, paddingTop: 6, paddingBottom: 12 },
  pending: { paddingStart: 40 },
  composerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  group: { flex: 1, height: 36, borderRadius: radius.full },
  input: { paddingStart: 14 },
  addon: { paddingEnd: 4 },
  send: { width: 27, height: 27 },
  reaction: { width: 28, height: 28, padding: 0, paddingHorizontal: 0 },
  contact: {
    alignItems: "center",
    gap: 4,
    borderBottomWidth: 1,
    paddingTop: 8,
    paddingBottom: 10,
  },
  avatar: { width: 48, height: 48 },
  name: { flexDirection: "row", alignItems: "center", gap: 2 },
  list: { gap: 4, paddingHorizontal: 2, paddingVertical: 12 },
  stamp: {
    marginTop: 4,
    marginBottom: 10,
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 24,
  },
  stampText: { ...fontSize["2xs"], textAlign: "center" },
})

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

function PhotoAttachment({
  photo,
  onRemove,
}: {
  photo: Photo
  onRemove?: () => void
}) {
  return (
    <Attachment size="sm" style={styles.attachment}>
      <AttachmentMedia variant="image">
        <Image
          source={{ uri: photo.image }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={styles.image}
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{photo.name}</AttachmentTitle>
        <AttachmentDescription>{photo.size}</AttachmentDescription>
      </AttachmentContent>
      {onRemove ? (
        <AttachmentActions>
          <AttachmentAction
            accessibilityLabel="Remove attachment"
            onPress={onRemove}
          >
            <Icon as={XIcon} />
          </AttachmentAction>
        </AttachmentActions>
      ) : null}
    </Attachment>
  )
}

function Composer({
  onSend,
  onAttach,
}: {
  onSend: (text: string, photo: Photo | null) => void
  onAttach?: () => void
}) {
  const { colors } = useTheme()
  const [draft, setDraft] = React.useState("")
  const [photo, setPhoto] = React.useState<Photo | null>(null)
  const { scrollToEnd } = useMessageScroller()
  const ready = draft.trim().length > 0 || photo !== null
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
    onSend(draft.trim(), photo)
    setDraft("")
    setPhoto(null)
    requestAnimationFrame(() => scrollToEnd())
  }

  return (
    <BottomBar>
      <BottomBarContent style={styles.composer}>
        {photo ? (
          <AnimatedView
            entering={FadeInDown.duration(300).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.pending}
          >
            <PhotoAttachment photo={photo} onRemove={() => setPhoto(null)} />
          </AnimatedView>
        ) : null}
        <View style={styles.composerRow}>
          <Button
            variant="secondary"
            size="icon-sm"
            accessibilityLabel="Add attachment"
            onPress={() => {
              onAttach?.()
              setPhoto(PHOTO)
            }}
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
              value={draft}
              onChangeText={setDraft}
              placeholder="Message"
              accessibilityLabel="Message"
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
        </View>
      </BottomBarContent>
    </BottomBar>
  )
}

function LineRow({
  line,
  onTap,
  onToggle,
}: {
  line: Line
  onTap: () => void
  onToggle: () => void
}) {
  const { colors } = useTheme()
  const mine = line.from === "me"
  const label = `${line.text ?? line.photo?.name ?? ""}${line.liked ? ", liked" : ""}. Double-tap to ${line.liked ? "remove the" : "add a"} heart.`
  return (
    <AnimatedView
      entering={FadeInDown.duration(700)
        .easing(Easing.bezier(0.32, 0.72, 0, 1))
        .reduceMotion(ReduceMotion.System)}
    >
      <Message align={mine ? "end" : "start"}>
        <MessageContent>
          {line.photo ? <PhotoAttachment photo={line.photo} /> : null}
          {line.text ? (
            <Bubble
              variant={mine ? "default" : "muted"}
              align={mine ? "end" : "start"}
            >
              <BubbleContent
                onPress={onTap}
                accessibilityLabel={label}
                accessibilityActions={[
                  { name: "activate" },
                  {
                    name: "like",
                    label: line.liked ? "Remove heart" : "Add heart",
                  },
                ]}
                onAccessibilityAction={(event) => {
                  const name = event.nativeEvent.actionName
                  if (name === "activate" || name === "like") onToggle()
                }}
              >
                {line.text}
              </BubbleContent>
              {line.liked ? (
                <BubbleReactions
                  side="top"
                  align={mine ? "start" : "end"}
                  style={[styles.reaction, { backgroundColor: colors.primary }]}
                >
                  <AnimatedView
                    entering={ZoomIn.duration(300).reduceMotion(
                      ReduceMotion.System
                    )}
                  >
                    <Icon
                      as={HeartIcon}
                      weight="fill"
                      size={13}
                      color={colors.primaryForeground}
                    />
                  </AnimatedView>
                </BubbleReactions>
              ) : null}
            </Bubble>
          ) : null}
        </MessageContent>
      </Message>
    </AnimatedView>
  )
}

function ChatThread({
  onSend,
  onAttach,
  onOpenContact,
  onLikeChange,
}: {
  onSend?: (text: string, attachment?: string) => void
  onAttach?: () => void
  onOpenContact?: () => void
  onLikeChange?: (id: string, liked: boolean) => void
}) {
  const { colors } = useTheme()
  const [lines, setLines] = React.useState(OPENING)
  const [typing, setTyping] = React.useState(false)
  const replyCount = React.useRef(0)
  const lastTap = React.useRef<{ id: string; time: number } | null>(null)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer)
    },
    []
  )

  const toggleLike = (line: Line) => {
    onLikeChange?.(line.id, !line.liked)
    setLines((current) =>
      current.map((item) =>
        item.id === line.id ? { ...item, liked: !item.liked } : item
      )
    )
  }

  const tap = (line: Line) => {
    const now = Date.now()
    const previous = lastTap.current
    if (
      previous &&
      previous.id === line.id &&
      now - previous.time < DOUBLE_TAP
    ) {
      lastTap.current = null
      toggleLike(line)
      return
    }
    lastTap.current = { id: line.id, time: now }
  }

  const send = (text: string, photo: Photo | null) => {
    onSend?.(text, photo?.name)
    setLines((current) => [
      ...current,
      {
        id: String(current.length),
        from: "me",
        text: text || undefined,
        photo: photo ?? undefined,
      },
    ])
    timers.current.push(setTimeout(() => setTyping(true), 500))
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setLines((current) => {
          const reply = REPLIES[replyCount.current++ % REPLIES.length]
          if (reply === undefined) return current
          return [
            ...current,
            { id: String(current.length), from: "them", text: reply },
          ]
        })
      }, 1800)
    )
  }

  const rows: Row[] = [
    { id: "stamp", kind: "stamp" },
    ...lines.map((line) => ({ kind: "line" as const, ...line })),
    ...(typing ? [{ id: "typing", kind: "typing" as const }] : []),
  ]

  return (
    <Screen edges={["top", "right", "left"]}>
      <MessageScrollerProvider>
        <Pressable
          role="button"
          accessibilityLabel="Riley"
          accessibilityHint="Shows contact details"
          onPress={onOpenContact}
          style={({ pressed }) => [
            styles.contact,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.background,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Avatar size="lg" style={styles.avatar}>
            <AvatarFallback style={{ backgroundColor: palette.green500 }}>
              <Text style={fontSize.lg}>RC</Text>
            </AvatarFallback>
          </Avatar>
          <View style={styles.name}>
            <Text style={[fontSize.xs, { fontWeight: "600" }]}>Riley</Text>
            <Icon
              as={CaretRightIcon}
              weight="bold"
              mirrored={I18nManager.isRTL}
              size={10}
              color={colors.foreground}
            />
          </View>
        </Pressable>
        <MessageScroller>
          <MessageScrollerViewport
            data={rows}
            keyExtractor={(row) => row.id}
            accessibilityLabel="Conversation with Riley"
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <MessageScrollerItem>
                {item.kind === "stamp" ? (
                  <View style={styles.stamp}>
                    <Text
                      style={[
                        styles.stampText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Today 9:30 AM
                    </Text>
                    <Text
                      style={[
                        styles.stampText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Double-tap a bubble to add a heart. Send a message and
                      you'll get a reply.
                    </Text>
                  </View>
                ) : null}
                {item.kind === "typing" ? <TypingDots /> : null}
                {item.kind === "line" ? (
                  <LineRow
                    line={item}
                    onTap={() => tap(item)}
                    onToggle={() => toggleLike(item)}
                  />
                ) : null}
              </MessageScrollerItem>
            )}
          />
        </MessageScroller>
        <Composer onSend={send} onAttach={onAttach} />
      </MessageScrollerProvider>
    </Screen>
  )
}

export { ChatThread }
