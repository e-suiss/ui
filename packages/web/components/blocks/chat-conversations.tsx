"use client"

import {
  ArrowUpIcon,
  InfoIcon,
  NotePencilIcon,
  PlusIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type Line = { id: string; from: "me" | "them"; text: string }

const threads = [
  {
    name: "Riley Chen",
    hue: 150,
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
    hue: 30,
    time: "8:12 AM",
    lines: [
      "them:I sent the deck, can you take a look?",
      "me:On it, back to you in 10 minutes",
    ],
  },
  {
    name: "Family",
    hue: 280,
    time: "Yesterday",
    lines: [
      "them:Is everyone coming for Sunday brunch?",
      "me:We'll be there",
      "them:I'll bring pastries",
    ],
  },
  {
    name: "Taylor Kim",
    hue: 200,
    time: "Monday",
    lines: ["them:What time does the game start?"],
  },
]

const replies: [string, ...string[]] = [
  "Sounds good",
  "Great, see you then!",
  "Ha, absolutely",
  "Let me check and get back to you",
]

const toLines = (lines: string[], thread: number): Line[] =>
  lines.map((line, index) => {
    const [from, ...text] = line.split(":")
    return {
      id: `${thread}-${index}`,
      from: from as Line["from"],
      text: text.join(":"),
    }
  })

function Initials({
  name,
  hue,
  className,
}: {
  name: string
  hue: number
  className?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={{
          background: `linear-gradient(160deg, oklch(0.78 0.1 ${hue}), oklch(0.6 0.14 ${hue + 30}))`,
        }}
        className="text-white"
      >
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}

function TypingDots() {
  return (
    <Message>
      <MessageContent>
        <Bubble variant="muted" aria-label="Typing">
          <BubbleContent className="flex gap-1 px-3.5 py-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                style={{ animationDelay: `${dot * 180}ms` }}
                className="size-2 animate-[pulse_1.1s_ease-in-out_infinite] rounded-full bg-label-tertiary"
              />
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
}: {
  placeholder: string
  onSend: (text: string) => void
}) {
  const [value, setValue] = React.useState("")
  const ready = value.trim().length > 0

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!ready) return
        onSend(value.trim())
        setValue("")
      }}
      className="flex shrink-0 items-center gap-2 px-4 pt-2.5 pb-3.5"
    >
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label="Add attachment"
        className="text-label-secondary"
      >
        <PlusIcon weight="bold" className="size-4.5" />
      </Button>
      <div className="flex min-h-8.5 flex-1 items-center rounded-full border border-separator-strong ps-3.5 pe-0.75 has-focus-visible:focus-ring">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-8 flex-1 rounded-none bg-transparent px-0 [--focus-ring-width:0px]"
        />
        <Button
          type="submit"
          size="icon-xs"
          aria-label="Send"
          disabled={!ready}
          data-ready={ready ? "" : undefined}
          className="size-6.75 scale-0 transition-[scale] duration-300 ease-[cubic-bezier(0.3,1.25,0.5,1)] data-ready:scale-100 motion-reduce:transition-none"
        >
          <ArrowUpIcon weight="bold" className="size-4" />
        </Button>
      </div>
    </form>
  )
}

export function ChatConversations() {
  const [conversations, setConversations] = React.useState(() =>
    threads.map((thread, index) => toLines(thread.lines, index))
  )
  const [selected, setSelected] = React.useState(0)
  const [typing, setTyping] = React.useState(false)
  const replyCount = React.useRef(0)
  const thread = threads[selected]
  const lines = conversations[selected]
  if (!thread || !lines) return null

  const send = (text: string) => {
    const target = selected
    setConversations((current) =>
      current.map((items, index) =>
        index === target
          ? [...items, { id: `${target}-${items.length}`, from: "me", text }]
          : items
      )
    )
    window.setTimeout(() => setTyping(true), 500)
    window.setTimeout(() => {
      const reply = replies[replyCount.current++ % replies.length] ?? replies[0]
      setTyping(false)
      setConversations((current) =>
        current.map((items, index) =>
          index === target
            ? [
                ...items,
                {
                  id: `${target}-${items.length}`,
                  from: "them",
                  text: reply,
                },
              ]
            : items
        )
      )
    }, 1800)
  }

  return (
    <SplitView
      defaultColumn="list"
      className="h-150 rounded-none border-0 max-md:h-auto max-md:min-h-150 max-md:p-4"
    >
      <SplitViewList title="Messages" className="gap-1 md:px-2 md:pt-3">
        <div className="flex items-center px-1.5 pb-1 max-md:-mt-12 max-md:justify-end">
          <span className="flex-1 text-lg font-semibold max-md:hidden">
            Messages
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="New message"
            className="text-label-secondary"
          >
            <NotePencilIcon className="size-4.5" />
          </Button>
        </div>
        {threads.map((item, index) => {
          const last = conversations[index]?.at(-1)
          return (
            <SplitViewItem
              key={item.name}
              isActive={index === selected}
              onClick={() => setSelected(index)}
              className="group/thread flex-row p-2.5 md:data-active:bg-accent md:data-active:text-on-accent"
            >
              <span className="flex items-center gap-2.5">
                <Initials
                  name={item.name}
                  hue={item.hue}
                  className="size-10.5"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="flex-1 truncate text-sm font-semibold">
                      {item.name}
                    </span>
                    <span className="text-xs text-label-secondary md:group-data-active/thread:text-on-accent">
                      {item.time}
                    </span>
                  </span>
                  <span className="truncate text-sm text-label-secondary md:group-data-active/thread:text-on-accent">
                    {last?.text}
                  </span>
                </span>
              </span>
            </SplitViewItem>
          )
        })}
      </SplitViewList>
      <SplitViewDetail
        title={thread.name}
        className="h-full p-0 md:p-0 [&>h2]:sr-only"
      >
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-separator px-4">
          <Initials name={thread.name} hue={thread.hue} className="size-7.5" />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold">{thread.name}</span>
            <span className="text-2xs text-label-secondary" aria-live="polite">
              {typing ? "typing…" : "Message"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Video call"
            className="text-accent"
          >
            <VideoCameraIcon className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Details"
            className="text-accent"
          >
            <InfoIcon className="size-5" />
          </Button>
        </div>
        <MessageScrollerProvider key={selected}>
          <MessageScroller className="min-h-80 flex-1">
            <MessageScrollerViewport
              aria-label={`Conversation with ${thread.name}`}
            >
              <MessageScrollerContent className="gap-1 px-5 py-4">
                <p className="mt-1 mb-2.5 text-center text-2xs text-label-secondary">
                  Today 9:30 AM
                </p>
                {lines.map((line) => (
                  <MessageScrollerItem key={line.id} messageId={line.id}>
                    <Message
                      align={line.from === "me" ? "end" : "start"}
                      className="transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
                    >
                      <MessageContent>
                        <Bubble
                          variant={line.from === "me" ? "default" : "muted"}
                          align={line.from === "me" ? "end" : "start"}
                          className="max-w-90"
                        >
                          <BubbleContent>{line.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
                {typing && (
                  <MessageScrollerItem messageId="typing">
                    <TypingDots />
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
        <Composer placeholder="Message" onSend={send} />
      </SplitViewDetail>
    </SplitView>
  )
}
