import {
  ArrowUpIcon,
  ChatCircleIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Image, ScrollView, StyleSheet, View } from "react-native"
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
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
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
import {
  fontSize,
  palette,
  radius,
  shadow,
  useTheme,
} from "@/components/ui/theme"

const IMAGE =
  "https://images.unsplash.com/photo-1634403665443-81dc4d75843a?w=900&q=80&auto=format&fit=crop"

type Line = { id: string; from: "me" | "them"; text: string }

type Row = { id: string; kind: "typing" } | ({ kind: "line" } & Line)

const ANSWERS: Record<string, string> = {
  "Where's my order?":
    "Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.",
  "Book a repair":
    "The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
  "I want to return something":
    "You can return items free of charge within 14 days of delivery. Should I email you a return label?",
}

const QUICK = Object.keys(ANSWERS)

const FALLBACK =
  "Got it. I'm connecting you with a Specialist, this may take a few minutes."

const PANEL_HEIGHT = 520

const PANEL_EASING = Easing.bezier(0.3, 1.15, 0.5, 1)

const LAUNCHER_EASING = Easing.bezier(0.3, 1.25, 0.5, 1)

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
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  group: { flex: 1, height: 36, borderRadius: radius.full },
  input: { paddingStart: 14 },
  addon: { paddingEnd: 4 },
  send: { width: 27, height: 27 },
  fill: { flex: 1 },
  hero: { paddingHorizontal: 24, paddingVertical: 40 },
  title: { ...fontSize["3xl"], fontWeight: "600", marginTop: 6 },
  image: { marginTop: 24, height: 220, width: "100%", borderRadius: 18 },
  panel: {
    position: "absolute",
    start: 12,
    end: 12,
    bottom: 12,
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  logo: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: radius.full },
  close: { width: 28, height: 28 },
  list: { gap: 4, paddingHorizontal: 4, paddingVertical: 12 },
  quick: { flexGrow: 0 },
  quickContent: { gap: 6, paddingHorizontal: 14, paddingBottom: 4 },
  launcher: { position: "absolute", end: 24, bottom: 24 },
  launcherButton: { borderRadius: radius.full },
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

function Composer({
  onSend,
  onAttach,
  onFocusChange,
}: {
  onSend: (text: string) => void
  onAttach?: () => void
  onFocusChange: (focused: boolean) => void
}) {
  const { colors } = useTheme()
  const [draft, setDraft] = React.useState("")
  const { scrollToEnd } = useMessageScroller()
  const ready = draft.trim().length > 0
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
    onSend(draft.trim())
    setDraft("")
    requestAnimationFrame(() => scrollToEnd())
  }

  return (
    <BottomBar>
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
            value={draft}
            onChangeText={setDraft}
            placeholder="Type your question"
            accessibilityLabel="Type your question"
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={send}
            onFocus={() => onFocusChange(true)}
            onBlur={() => onFocusChange(false)}
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

function ChatSupport({
  onSend,
  onAttach,
  onOpenChange,
}: {
  onSend?: (text: string) => void
  onAttach?: () => void
  onOpenChange?: (open: boolean) => void
}) {
  const { colors } = useTheme()
  const [open, setOpen] = React.useState(true)
  const [lines, setLines] = React.useState<Line[]>([
    {
      id: "0",
      from: "them",
      text: "Hi Jamie, I'm the suiss Support assistant. How can I help?",
    },
  ])
  const [typing, setTyping] = React.useState(false)
  const [height, setHeight] = React.useState(0)
  const [focused, setFocused] = React.useState(false)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const panel = useSharedValue(1)
  const launcher = useSharedValue(0)

  React.useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer)
    },
    []
  )

  React.useEffect(() => {
    panel.value = withTiming(open ? 1 : 0, {
      duration: open ? 500 : 250,
      easing: open ? PANEL_EASING : Easing.ease,
      reduceMotion: ReduceMotion.System,
    })
    launcher.value = withTiming(open ? 0 : 1, {
      duration: 400,
      easing: LAUNCHER_EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [open, panel, launcher])

  const panelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, panel.value * 2),
    transform: [{ scale: 0.2 + panel.value * 0.8 }],
  }))

  const launcherStyle = useAnimatedStyle(() => ({
    transform: [{ scale: launcher.value }],
  }))

  const change = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  const ask = (question: string) => {
    onSend?.(question)
    setLines((current) => [
      ...current,
      { id: String(current.length), from: "me", text: question },
    ])
    setTyping(true)
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setLines((current) => [
          ...current,
          {
            id: String(current.length),
            from: "them",
            text: ANSWERS[question] ?? FALLBACK,
          },
        ])
      }, 1200)
    )
  }

  const rows: Row[] = [
    ...lines.map((line) => ({ kind: "line" as const, ...line })),
    ...(typing ? [{ id: "typing", kind: "typing" as const }] : []),
  ]
  const quick = QUICK.filter(
    (question) => !lines.some((line) => line.text === question)
  )
  const available = Math.max(0, height - 24)
  const panelHeight = focused ? available : Math.min(PANEL_HEIGHT, available)

  return (
    <Screen variant="secondary">
      <View
        style={styles.fill}
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      >
        <ScrollView
          accessibilityElementsHidden={open}
          importantForAccessibility={open ? "no-hide-descendants" : "auto"}
          contentContainerStyle={styles.hero}
        >
          <Text
            style={[
              fontSize.lg,
              { fontWeight: "600", color: colors.mutedForeground },
            ]}
          >
            suiss Support
          </Text>
          <Text role="heading" style={styles.title}>
            How can we help you?
          </Text>
          <Image
            source={{ uri: IMAGE }}
            resizeMode="cover"
            accessible
            accessibilityLabel="A phone resting on a soft beige surface"
            accessibilityIgnoresInvertColors
            style={[styles.image, { backgroundColor: colors.secondary }]}
          />
        </ScrollView>
        {height > 0 ? (
          <AnimatedView
            pointerEvents={open ? "auto" : "none"}
            accessibilityViewIsModal={open}
            accessibilityElementsHidden={!open}
            importantForAccessibility={open ? "auto" : "no-hide-descendants"}
            accessibilityLabel="suiss Support chat"
            style={[
              styles.panel,
              shadow.lg,
              {
                height: panelHeight,
                borderColor: colors.border,
                backgroundColor: colors.background,
                transformOrigin: I18nManager.isRTL
                  ? "left bottom"
                  : "right bottom",
              },
              panelStyle,
            ]}
          >
            <MessageScrollerProvider>
              <View
                style={[
                  styles.panelHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View
                  style={[styles.logo, { backgroundColor: colors.foreground }]}
                >
                  <Text
                    style={[
                      fontSize.base,
                      { fontWeight: "700", color: colors.background },
                    ]}
                  >
                    s
                  </Text>
                </View>
                <View style={styles.fill}>
                  <Text
                    role="heading"
                    style={[fontSize.sm, { fontWeight: "600" }]}
                  >
                    suiss Support
                  </Text>
                  <View style={styles.status}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: palette.green500 },
                      ]}
                    />
                    <Text
                      style={[fontSize["2xs"], { color: palette.green500 }]}
                    >
                      Online
                    </Text>
                  </View>
                </View>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  accessibilityLabel="Close chat"
                  onPress={() => change(false)}
                  style={styles.close}
                >
                  <Icon
                    as={XIcon}
                    weight="bold"
                    size={13}
                    color={colors.mutedForeground}
                  />
                </Button>
              </View>
              <MessageScroller>
                <MessageScrollerViewport
                  data={rows}
                  keyExtractor={(row) => row.id}
                  accessibilityLabel="Support conversation"
                  contentContainerStyle={styles.list}
                  renderItem={({ item }) => (
                    <MessageScrollerItem>
                      {item.kind === "typing" ? (
                        <TypingDots />
                      ) : (
                        <AnimatedView
                          entering={FadeInDown.duration(700)
                            .easing(Easing.bezier(0.32, 0.72, 0, 1))
                            .reduceMotion(ReduceMotion.System)}
                        >
                          <Message align={item.from === "me" ? "end" : "start"}>
                            <MessageContent>
                              <Bubble
                                variant={
                                  item.from === "me" ? "default" : "muted"
                                }
                                align={item.from === "me" ? "end" : "start"}
                              >
                                <BubbleContent>
                                  <Text style={fontSize.sm}>{item.text}</Text>
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </AnimatedView>
                      )}
                    </MessageScrollerItem>
                  )}
                />
              </MessageScroller>
              {quick.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={styles.quick}
                  contentContainerStyle={styles.quickContent}
                >
                  {quick.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      onPress={() => ask(question)}
                      style={{ borderColor: colors.primary }}
                    >
                      <Text style={{ color: colors.primary }}>{question}</Text>
                    </Button>
                  ))}
                </ScrollView>
              ) : null}
              <Composer
                onSend={ask}
                onAttach={onAttach}
                onFocusChange={setFocused}
              />
            </MessageScrollerProvider>
          </AnimatedView>
        ) : null}
        <AnimatedView
          pointerEvents={open ? "none" : "auto"}
          accessibilityElementsHidden={open}
          importantForAccessibility={open ? "no-hide-descendants" : "auto"}
          style={[styles.launcher, launcherStyle]}
        >
          <Button
            size="icon-xl"
            accessibilityLabel="Open chat"
            accessibilityState={{ expanded: open }}
            onPress={() => change(true)}
            style={[styles.launcherButton, shadow.lg]}
          >
            <Icon as={ChatCircleIcon} weight="fill" size={24} />
          </Button>
        </AnimatedView>
      </View>
    </Screen>
  )
}

export { ChatSupport }
