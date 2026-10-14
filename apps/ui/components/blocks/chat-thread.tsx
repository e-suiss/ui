"use client"

import {
  ArrowUpIcon,
  CaretRightIcon,
  HeartIcon,
  PlusIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"
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

type Line = { id: string; from: "me" | "them"; text: string; liked?: boolean }

const opening: Line[] = [
  { id: "0", from: "them", text: "Is the weekend trip to the coast still on?" },
  { id: "1", from: "me", text: "Yes! We leave Friday evening" },
  { id: "2", from: "me", text: "I booked the boat tour, it leaves at 5 AM" },
  { id: "3", from: "them", text: "Great, I'll bring the camera" },
]

const replies = [
  "Sounds good",
  "Great, see you then!",
  "Ha, absolutely",
  "Let me check and get back to you",
]

export function ChatThread() {
  const [lines, setLines] = React.useState(opening)
  const [typing, setTyping] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const replyCount = React.useRef(0)
  const ready = draft.trim().length > 0

  const toggleLike = (id: string) =>
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, liked: !line.liked } : line
      )
    )

  const send = (text: string) => {
    setLines((current) => [
      ...current,
      { id: String(current.length), from: "me", text },
    ])
    window.setTimeout(() => setTyping(true), 500)
    window.setTimeout(() => {
      setTyping(false)
      setLines((current) => {
        const text = replies[replyCount.current++ % replies.length]
        if (text === undefined) return current
        return [...current, { id: String(current.length), from: "them", text }]
      })
    }, 1800)
  }

  return (
    <section className="flex min-h-170 flex-col items-center justify-center gap-12 bg-surface-secondary sm:p-5 md:flex-row">
      <div className="relative flex h-170 w-full flex-col overflow-hidden bg-surface sm:h-160 sm:w-82.5 sm:shrink-0 sm:rounded-[3rem] sm:border-10 sm:border-black sm:shadow-[0_0_0_1.5px_var(--color-label-tertiary),0_30px_60px_-20px_rgb(0_0_0/0.45)]">
        <span
          aria-hidden
          className="absolute top-2.5 left-1/2 z-10 hidden h-7 w-24 -translate-x-1/2 rounded-full bg-black sm:block"
        />
        <a
          href="#contact"
          className="flex shrink-0 flex-col items-center gap-1 border-b border-separator bg-surface/85 pt-6 pb-2.5 outline-none backdrop-blur-xl focus-visible:focus-ring sm:pt-12.5"
        >
          <Avatar className="size-12">
            <AvatarFallback className="bg-linear-to-br from-[oklch(0.78_0.1_150)] to-[oklch(0.6_0.14_180)] text-lg text-white dark:from-[oklch(0.78_0.1_150)] dark:to-[oklch(0.6_0.14_180)]">
              RC
            </AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-0.5 text-xs font-semibold">
            Riley
            <CaretRightIcon weight="bold" className="size-2.5 rtl:rotate-180" />
          </span>
        </a>
        <MessageScrollerProvider>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport aria-label="Conversation with Riley">
              <MessageScrollerContent className="gap-1 px-3 py-3">
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
                          className="max-w-57.5"
                        >
                          <BubbleContent
                            render={<button type="button" />}
                            onDoubleClick={() => toggleLike(line.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") toggleLike(line.id)
                            }}
                            aria-label={`${line.text}${line.liked ? ", liked" : ""}. Double-click to ${line.liked ? "remove the" : "add a"} heart.`}
                            className="select-none"
                          >
                            {line.text}
                          </BubbleContent>
                          {line.liked && (
                            <BubbleReactions
                              side="top"
                              align={line.from === "me" ? "start" : "end"}
                              className="size-6.5 bg-accent p-0 text-on-accent ring-2 ring-surface transition-[scale] duration-300 ease-[cubic-bezier(0.3,1.25,0.5,1)] starting:scale-0 dark:bg-accent"
                            >
                              <HeartIcon weight="fill" className="size-3.25" />
                            </BubbleReactions>
                          )}
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
                {typing && (
                  <MessageScrollerItem messageId="typing">
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
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!ready) return
            send(draft.trim())
            setDraft("")
          }}
          className="flex shrink-0 items-center gap-2 px-2.5 pt-1.5 pb-6"
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
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message"
              aria-label="Message"
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
      </div>
      <div className="flex max-w-75 flex-col gap-2 px-6 pb-10 max-md:text-center md:px-0 md:pb-0">
        <p className="text-sm font-semibold text-label-secondary">Phone</p>
        <h2 className="text-4xl font-semibold tracking-tight">Messages.</h2>
        <p className="text-lg text-label-secondary">
          Double-click a bubble to add a heart. Send a message and you'll get a
          reply.
        </p>
      </div>
    </section>
  )
}
