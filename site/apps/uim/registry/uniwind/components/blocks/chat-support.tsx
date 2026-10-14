import {
  ArrowUpIcon,
  ChatCircleIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Image, ScrollView, View } from "react-native"
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
      className="size-2 rounded-full bg-label-tertiary"
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
  onSend,
  onAttach,
  onFocusChange,
}: {
  onSend: (text: string) => void
  onAttach?: () => void
  onFocusChange: (focused: boolean) => void
}) {
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
      <BottomBarContent className="flex-row items-center gap-2 px-3 pt-2 pb-3">
        <Button
          variant="secondary"
          size="icon-sm"
          accessibilityLabel="Add attachment"
          onPress={onAttach}
        >
          <Icon
            as={PlusIcon}
            weight="bold"
            className="size-4.5 text-label-secondary"
          />
        </Button>
        <InputGroup className="h-9 flex-1 rounded-full">
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
                className="size-6.75"
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

function ChatSupport({
  onSend,
  onAttach,
  onOpenChange,
}: {
  onSend?: (text: string) => void
  onAttach?: () => void
  onOpenChange?: (open: boolean) => void
}) {
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
        className="flex-1"
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      >
        <ScrollView
          accessibilityElementsHidden={open}
          importantForAccessibility={open ? "no-hide-descendants" : "auto"}
          contentContainerClassName="px-6 py-10"
        >
          <Text className="text-lg font-semibold text-label-secondary">
            suiss Support
          </Text>
          <Text
            role="heading"
            className="mt-1.5 text-3xl font-semibold tracking-tight"
          >
            How can we help you?
          </Text>
          <Image
            source={{ uri: IMAGE }}
            resizeMode="cover"
            accessible
            accessibilityLabel="A phone resting on a soft beige surface"
            accessibilityIgnoresInvertColors
            className="mt-6 h-55 w-full rounded-[1.125rem] bg-control"
          />
        </ScrollView>
        {height > 0 ? (
          <AnimatedView
            pointerEvents={open ? "auto" : "none"}
            accessibilityViewIsModal={open}
            accessibilityElementsHidden={!open}
            importantForAccessibility={open ? "auto" : "no-hide-descendants"}
            accessibilityLabel="suiss Support chat"
            className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[1.375rem] border border-separator bg-surface shadow-lg"
            style={[
              {
                height: panelHeight,
                transformOrigin: I18nManager.isRTL
                  ? "left bottom"
                  : "right bottom",
              },
              panelStyle,
            ]}
          >
            <MessageScrollerProvider>
              <View className="flex-row items-center gap-2.5 border-b border-separator px-3.5 py-3">
                <View className="size-8.5 items-center justify-center rounded-full bg-label">
                  <Text className="text-base font-bold text-surface">s</Text>
                </View>
                <View className="flex-1">
                  <Text role="heading" className="text-sm font-semibold">
                    suiss Support
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <View className="size-1.5 rounded-full bg-green" />
                    <Text className="text-2xs text-green">Online</Text>
                  </View>
                </View>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  accessibilityLabel="Close chat"
                  onPress={() => change(false)}
                  className="size-7"
                >
                  <Icon
                    as={XIcon}
                    weight="bold"
                    className="size-3.25 text-label-secondary"
                  />
                </Button>
              </View>
              <MessageScroller>
                <MessageScrollerViewport
                  data={rows}
                  keyExtractor={(row) => row.id}
                  accessibilityLabel="Support conversation"
                  contentContainerClassName="gap-1 px-1 py-3"
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
                                  <Text className="text-sm">{item.text}</Text>
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
                  className="grow-0"
                  contentContainerClassName="gap-1.5 px-3.5 pb-1"
                >
                  {quick.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      onPress={() => ask(question)}
                      className="border-accent"
                    >
                      <Text className="text-link">{question}</Text>
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
          className="absolute end-6 bottom-6"
          style={launcherStyle}
        >
          <Button
            size="icon-xl"
            accessibilityLabel="Open chat"
            accessibilityState={{ expanded: open }}
            onPress={() => change(true)}
            className="rounded-full shadow-lg"
          >
            <Icon as={ChatCircleIcon} weight="fill" className="size-6" />
          </Button>
        </AnimatedView>
      </View>
    </Screen>
  )
}

export { ChatSupport }
