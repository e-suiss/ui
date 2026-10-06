import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { PullToRefresh } from "@/components/interactions/pull-to-refresh"

const senders = [
  ["Acme Store", "Your order has shipped"],
  ["Jordan Lee", "Tomorrow's meeting"],
  ["Cloud Drive", "Your storage is almost full"],
  ["Taylor Kim", "Weekend plans"],
  ["Design Team", "New mockups are ready"],
  ["Sam Rivera", "Lunch on Thursday?"],
  ["Bank Alerts", "Your statement is available"],
  ["Riley Park", "Photos from the trip"],
]

const incoming = [
  ["Morgan Diaz", "Quick question about the brief"],
  ["Travel Desk", "Your flight is confirmed"],
  ["Alex Chen", "Re: Project timeline"],
  ["News Digest", "Today's top stories"],
]

type Message = { id: number; from: string; subject: string; fresh: boolean }

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function InboxExample({ empty = false }: { empty?: boolean }) {
  const [messages, setMessages] = React.useState<Message[]>(() =>
    empty
      ? []
      : senders.map(([from, subject], index) => ({
          id: index,
          from,
          subject,
          fresh: false,
        }))
  )
  const [log, setLog] = React.useState("Pull down from the top to refresh.")
  const count = React.useRef(0)

  const refresh = async () => {
    setLog("Refreshing…")
    await wait(1200)
    const [from, subject] = incoming[count.current % incoming.length]
    count.current += 1
    setMessages((current) => [
      { id: 100 + count.current, from, subject, fresh: true },
      ...current.map((message) => ({ ...message, fresh: false })),
    ])
    setLog(`New message from ${from}`)
  }

  return (
    <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      <PullToRefresh
        onRefresh={refresh}
        className="h-[min(36rem,calc(100dvh-6rem))] rounded-2xl border"
      >
        <h2 className="px-4 pt-4 pb-2 text-3xl font-bold tracking-tight">
          Inbox
        </h2>
        {messages.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-label-secondary">
            No messages yet.
          </p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                data-fresh={message.fresh ? "" : undefined}
                className="ms-4 border-separator not-first:border-t starting:opacity-0 data-fresh:transition-opacity data-fresh:duration-500"
              >
                <button
                  type="button"
                  onClick={() => setLog(`Opened ${message.subject}`)}
                  className="flex w-full flex-col py-3 pe-4 text-start outline-none focus-visible:focus-ring"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {message.fresh && (
                      <span className="size-2 rounded-full bg-accent" />
                    )}
                    {message.from}
                  </span>
                  <span className="truncate text-sm text-label-secondary">
                    {message.subject}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PullToRefresh>
      <p role="status" className="text-sm text-label-secondary">
        {log}
      </p>
    </div>
  )
}

const meta = {
  title: "Interactions/Pull to Refresh",
  component: PullToRefresh,
} satisfies Meta<typeof PullToRefresh>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onRefresh: () => undefined },
  render: () => <InboxExample />,
}

export const EmptyList: Story = {
  args: { onRefresh: () => undefined },
  render: () => <InboxExample empty />,
}
