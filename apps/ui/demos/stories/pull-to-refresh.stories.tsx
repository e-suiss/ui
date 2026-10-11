// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, waitFor, within } from "storybook/test"

import { PullToRefresh } from "@/components/interactions/pull-to-refresh"

const senders: [from: string, subject: string][] = [
  ["Acme Store", "Your order has shipped"],
  ["Jordan Lee", "Tomorrow's meeting"],
  ["Cloud Drive", "Your storage is almost full"],
  ["Taylor Kim", "Weekend plans"],
  ["Design Team", "New mockups are ready"],
  ["Sam Rivera", "Lunch on Thursday?"],
  ["Bank Alerts", "Your statement is available"],
  ["Riley Park", "Photos from the trip"],
]

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

function canCreateTouch() {
  try {
    return Boolean(new Touch({ identifier: 0, target: document.body }))
  } catch {
    return false
  }
}

function scrollerOf(element: HTMLElement) {
  const scroller = element.closest<HTMLElement>("[data-slot=pull-to-refresh]")
  if (!scroller) throw new Error("Pull to refresh is not rendered")
  return scroller
}

function touchAt(target: HTMLElement, clientY: number) {
  const { left, width } = target.getBoundingClientRect()
  return new Touch({
    identifier: 1,
    target,
    clientX: left + width / 2,
    clientY,
  })
}

async function dragDown(target: HTMLElement, distance: number) {
  const { top } = target.getBoundingClientRect()
  const start = touchAt(target, top + 10)
  const touch = (type: string, point: Touch) =>
    target.dispatchEvent(
      new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === "touchend" ? [] : [point],
        changedTouches: [point],
      })
    )
  touch("touchstart", start)
  let last = start
  for (let step = 1; step <= 10; step += 1) {
    last = touchAt(target, top + 10 + (distance * step) / 10)
    touch("touchmove", last)
    await wait(16)
  }
  touch("touchend", last)
}

async function wheelDown(target: HTMLElement, distance: number) {
  for (let step = 0; step < 4; step += 1) {
    target.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: -distance / 4,
      })
    )
    await wait(16)
  }
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
  play: async ({ canvas, step }) => {
    const heading = canvas.getByRole("heading", { name: "Inbox" })
    const scroller = scrollerOf(heading)
    if (!canCreateTouch()) return

    await step("ignores a short pull", async () => {
      await dragDown(heading, 60)
      await waitFor(() =>
        expect(scroller).toHaveAttribute("data-phase", "idle")
      )
      await expect(scroller).toHaveAttribute("aria-busy", "false")
      await expect(
        canvas.getByText("Pull down from the top to refresh.")
      ).toBeInTheDocument()
    })

    await step("refreshes after dragging past the threshold", async () => {
      await dragDown(heading, 300)
      await expect(scroller).toHaveAttribute("aria-busy", "true")
      await expect(
        within(scroller).getByRole("status", { name: "Refreshing" })
      ).toBeInTheDocument()
      await expect(canvas.getByText("Refreshing…")).toBeInTheDocument()
    })

    await step("settles with the new message on top", async () => {
      await waitFor(
        () => expect(scroller).toHaveAttribute("data-phase", "idle"),
        { timeout: 4000 }
      )
      await expect(scroller).toHaveAttribute("aria-busy", "false")
      await expect(
        canvas.getByText("New message from Morgan Diaz")
      ).toBeInTheDocument()
      const [first] = within(scroller).getAllByRole("listitem")
      await expect(first).toHaveTextContent("Morgan Diaz")
    })
  },
}

export const EmptyList: Story = {
  args: { onRefresh: () => undefined },
  render: () => <InboxExample empty />,
  play: async ({ canvas, step }) => {
    const heading = canvas.getByRole("heading", { name: "Inbox" })
    const scroller = scrollerOf(heading)

    await step("refreshes from a trackpad pull", async () => {
      await expect(canvas.getByText("No messages yet.")).toBeInTheDocument()
      await wheelDown(heading, 300)
      await waitFor(() => expect(scroller).toHaveAttribute("aria-busy", "true"))
      await expect(
        within(scroller).getByRole("status", { name: "Refreshing" })
      ).toBeInTheDocument()
    })

    await step("fills the empty list once it settles", async () => {
      await waitFor(
        () => expect(scroller).toHaveAttribute("data-phase", "idle"),
        { timeout: 4000 }
      )
      await expect(canvas.queryByText("No messages yet.")).toBeNull()
      await expect(within(scroller).getAllByRole("listitem")).toHaveLength(1)
    })
  },
}
