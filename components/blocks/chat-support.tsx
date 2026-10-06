"use client"

import {
  ArrowUpIcon,
  ChatCircleIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react"
import * as React from "react"

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

const image =
  "https://images.unsplash.com/photo-1634403665443-81dc4d75843a?w=900&q=80&auto=format&fit=crop"

type Line = { id: string; from: "me" | "them"; text: string }

const answers: Record<string, string> = {
  "Where's my order?":
    "Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.",
  "Book a repair":
    "The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
  "I want to return something":
    "You can return items free of charge within 14 days of delivery. Should I email you a return label?",
}

const quick = Object.keys(answers)

export function ChatSupport() {
  const [open, setOpen] = React.useState(true)
  const [lines, setLines] = React.useState<Line[]>([
    {
      id: "0",
      from: "them",
      text: "Hi Jamie, I'm the suiss Support assistant. How can I help?",
    },
  ])
  const [typing, setTyping] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const launcherRef = React.useRef<HTMLButtonElement>(null)
  const ready = draft.trim().length > 0

  React.useEffect(() => {
    if (!open) launcherRef.current?.focus()
  }, [open])

  const ask = (question: string) => {
    setLines((current) => [
      ...current,
      { id: String(current.length), from: "me", text: question },
    ])
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setLines((current) => [
        ...current,
        {
          id: String(current.length),
          from: "them",
          text:
            answers[question] ??
            "Got it. I'm connecting you with a Specialist, this may take a few minutes.",
        },
      ])
    }, 1200)
  }

  return (
    <section className="relative min-h-155 overflow-hidden bg-surface-secondary">
      <div className="max-w-130 px-6 py-10 md:px-12">
        <p className="text-lg font-semibold text-label-secondary">
          suiss Support
        </p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          How can we help you?
        </h1>
        <img
          src={image}
          alt="A phone resting on a soft beige surface"
          className="mt-6 h-55 w-full rounded-[1.125rem] bg-control object-cover"
        />
      </div>
      <div
        role="dialog"
        aria-label="suiss Support chat"
        inert={!open}
        data-open={open ? "" : undefined}
        className="absolute inset-x-3 bottom-3 flex h-[min(32.5rem,calc(100%-1.5rem))] origin-bottom-right scale-20 flex-col overflow-hidden rounded-[1.375rem] bg-surface opacity-0 shadow-[0_0_0_0.5px_var(--color-separator),0_24px_60px_rgb(0_0_0/0.2)] transition-[scale,opacity] duration-[500ms,250ms] ease-[cubic-bezier(0.3,1.15,0.5,1),ease] data-open:scale-100 data-open:opacity-100 motion-reduce:transition-none sm:inset-x-auto sm:end-6 sm:bottom-6 sm:w-90"
      >
        <div className="flex shrink-0 items-center gap-2.5 border-b border-separator px-3.5 py-3">
          <span className="flex size-8.5 items-center justify-center rounded-full bg-label text-base font-bold text-surface">
            s
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold">suiss Support</span>
            <span className="flex items-center gap-1 text-2xs text-[color-mix(in_oklab,var(--green),var(--label)_45%)] dark:text-green">
              <span className="size-1.5 rounded-full bg-current" />
              Online
            </span>
          </div>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="size-7 text-label-secondary"
          >
            <XIcon weight="bold" className="size-3.25" />
          </Button>
        </div>
        <MessageScrollerProvider>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport aria-label="Support conversation">
              <MessageScrollerContent className="gap-1 px-3.5 py-3">
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
                          className="max-w-62.5"
                        >
                          <BubbleContent className="text-sm">
                            {line.text}
                          </BubbleContent>
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
        <div className="flex flex-wrap gap-1.5 px-3.5 pb-1">
          {quick
            .filter((question) => !lines.some((line) => line.text === question))
            .map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => ask(question)}
                className="border-accent text-link hover:text-link"
              >
                {question}
              </Button>
            ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!ready) return
            ask(draft.trim())
            setDraft("")
          }}
          className="flex shrink-0 items-center gap-2 px-3 pt-2 pb-3"
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
              placeholder="Type your question"
              aria-label="Type your question"
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
      <Button
        ref={launcherRef}
        size="icon-xl"
        aria-label="Open chat"
        aria-expanded={open}
        inert={open}
        onClick={() => setOpen(true)}
        data-open={open ? "" : undefined}
        className="absolute end-6 bottom-6 shadow-[0_10px_30px_color-mix(in_oklab,var(--color-accent)_40%,transparent)] transition-[scale] duration-400 ease-[cubic-bezier(0.3,1.25,0.5,1)] data-open:scale-0 motion-reduce:transition-none"
      >
        <ChatCircleIcon weight="fill" className="size-6" />
      </Button>
    </section>
  )
}
