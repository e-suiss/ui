import * as React from "react"
import { PullToRefresh } from "@/components/interactions/pull-to-refresh"

const incoming: [from: string, subject: string][] = [
  ["Morgan Diaz", "Quick question about the brief"],
  ["Travel Desk", "Your flight is confirmed"],
  ["Alex Chen", "Re: Project timeline"],
  ["News Digest", "Today's top stories"],
]

type Message = { id: number; from: string; subject: string; fresh: boolean }

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function PullToRefreshEmptyList() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [log, setLog] = React.useState("Pull down from the top to refresh.")
  const count = React.useRef(0)

  const refresh = async () => {
    setLog("Refreshing…")
    await wait(1200)
    const next = incoming[count.current % incoming.length]
    if (!next) return
    const [from, subject] = next
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
        className="h-[min(36rem,calc(100dvh-7rem))] rounded-2xl border"
      >
        <h2 className="px-4 pt-4 pb-2 text-3xl font-bold tracking-tight">
          Inbox
        </h2>
        {messages.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                data-fresh={message.fresh ? "" : undefined}
                className="ms-4 border-border not-first:border-t starting:opacity-0 data-fresh:transition-opacity data-fresh:duration-500"
              >
                <button
                  type="button"
                  onClick={() => setLog(`Opened ${message.subject}`)}
                  className="flex w-full flex-col py-3 pe-4 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {message.fresh && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                    {message.from}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {message.subject}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PullToRefresh>
      <p role="status" className="text-sm text-muted-foreground">
        {log}
      </p>
    </div>
  )
}
