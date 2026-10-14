// @ts-nocheck
import {
  ArchiveIcon,
  BellSlashIcon,
  EnvelopeSimpleIcon,
  FlagIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { Button } from "@/components/ui/button"
import { MOUSE_POINTER_ID } from "./pointer"

const initialMessages = [
  {
    id: 1,
    from: "Acme Store",
    subject: "Your order has shipped",
    preview: "Order #1042 will be delivered tomorrow.",
  },
  {
    id: 2,
    from: "Jordan Lee",
    subject: "Tomorrow's meeting",
    preview: "Does 10:00 work for you?",
  },
  {
    id: 3,
    from: "Cloud Drive",
    subject: "Your storage is almost full",
    preview: "Upgrade your plan to get more space.",
  },
  {
    id: 4,
    from: "Taylor Kim",
    subject: "Weekend plans",
    preview: "Are we still on for Saturday?",
  },
]

function MailExample({ withLeading = false }: { withLeading?: boolean }) {
  const [messages, setMessages] = React.useState(initialMessages)
  const [unread, setUnread] = React.useState<number[]>([])
  const [log, setLog] = React.useState("Swipe a message to the left.")

  const remove = (id: number, action: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
    setLog(`${action} message ${id}`)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <ul className="overflow-hidden rounded-2xl border">
        {messages.map((message) => (
          <li key={message.id} className="not-first:border-t">
            <SwipeActions>
              {withLeading && (
                <SwipeActionsActions side="leading">
                  <SwipeAction
                    onClick={() => {
                      setUnread((current) =>
                        current.includes(message.id)
                          ? current.filter((id) => id !== message.id)
                          : [...current, message.id]
                      )
                      setLog(`Toggled unread on message ${message.id}`)
                    }}
                  >
                    <EnvelopeSimpleIcon weight="fill" />
                    Unread
                  </SwipeAction>
                </SwipeActionsActions>
              )}
              <SwipeActionsContent className="flex flex-col gap-0.5 px-4 py-3">
                <span className="flex items-center gap-2 font-semibold">
                  {unread.includes(message.id) && (
                    <span className="size-2 rounded-full bg-accent" />
                  )}
                  {message.from}
                </span>
                <span className="text-sm">{message.subject}</span>
                <span className="truncate text-sm text-label-secondary">
                  {message.preview}
                </span>
              </SwipeActionsContent>
              <SwipeActionsActions>
                <SwipeAction
                  variant="archive"
                  onClick={() => remove(message.id, "Archived")}
                >
                  <ArchiveIcon weight="fill" />
                  Archive
                </SwipeAction>
                <SwipeAction
                  variant="destructive"
                  fullSwipe
                  onClick={() => remove(message.id, "Deleted")}
                >
                  <TrashIcon weight="fill" />
                  Delete
                </SwipeAction>
              </SwipeActionsActions>
            </SwipeActions>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-label-secondary">
          {log}
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setMessages(initialMessages)
            setUnread([])
            setLog("Swipe a message to the left.")
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

const meta = {
  title: "Interactions/Swipe Actions",
  component: SwipeActions,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SwipeActions>

export default meta

type Story = StoryObj<typeof meta>

function pointer(target: EventTarget, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: MOUSE_POINTER_ID,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

function swipe(content: HTMLElement, dx: number) {
  const rect = content.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(content, "pointerdown", x, y)
  for (let step = 1; step <= 4; step++) {
    pointer(content, "pointermove", x + (dx * step) / 4, y)
  }
  pointer(content, "pointerup", x + dx, y)
}

function rowOf(element: HTMLElement) {
  const row = element.closest<HTMLElement>("[data-slot=swipe-actions]")
  const content = row?.querySelector<HTMLElement>(
    "[data-slot=swipe-actions-content]"
  )
  if (!row || !content) throw new Error("swipe row not found")
  return { row, content }
}

export const Default: Story = {
  render: () => <MailExample />,
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")

    await step("reveals the trailing actions with a swipe left", async () => {
      const { row, content } = rowOf(canvas.getByText("Acme Store"))
      swipe(content, -120)
      await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
      await expect(
        within(row).getByRole("button", { name: "Archive" })
      ).toBeVisible()
    })

    await step("runs the tapped action", async () => {
      const { row } = rowOf(canvas.getByText("Acme Store"))
      await userEvent.click(
        within(row).getByRole("button", { name: "Archive" })
      )
      await expect(status).toHaveTextContent("Archived message 1")
      await expect(canvas.queryByText("Acme Store")).toBeNull()
    })

    await step("deletes a message with a full swipe", async () => {
      const { content } = rowOf(canvas.getByText("Jordan Lee"))
      swipe(content, -content.offsetWidth * 0.8)
      await waitFor(() => expect(status).toHaveTextContent("Deleted message 2"))
      await expect(canvas.queryByText("Jordan Lee")).toBeNull()
    })

    await step("closes an open row when tapping it", async () => {
      const { row, content } = rowOf(canvas.getByText("Cloud Drive"))
      swipe(content, -120)
      await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
      await userEvent.click(content)
      await waitFor(() => expect(row).not.toHaveAttribute("data-open"))
      await expect(status).toHaveTextContent("Deleted message 2")
    })

    await step("restores every message with reset", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
      await expect(canvas.getByText("Acme Store")).toBeVisible()
      await expect(canvas.getByText("Jordan Lee")).toBeVisible()
    })
  },
}

export const BothSides: Story = {
  render: () => <MailExample withLeading />,
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")
    const { row, content } = rowOf(canvas.getByText("Acme Store"))

    await step("reveals the leading action with a swipe right", async () => {
      swipe(content, 100)
      await waitFor(() => expect(row).toHaveAttribute("data-open", "leading"))
    })

    await step("toggles unread from the leading action", async () => {
      await userEvent.click(within(row).getByRole("button", { name: "Unread" }))
      await expect(status).toHaveTextContent("Toggled unread on message 1")
      await waitFor(() => expect(row).not.toHaveAttribute("data-open"))
    })

    await step("still reveals the trailing actions the other way", async () => {
      swipe(content, -120)
      await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
    })
  },
}

export const Variants: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border">
      <SwipeActions>
        <SwipeActionsContent className="px-4 py-3">
          Swipe to see every action style
        </SwipeActionsContent>
        <SwipeActionsActions>
          <SwipeAction>
            <FlagIcon weight="fill" />
            Flag
          </SwipeAction>
          <SwipeAction variant="neutral">
            <BellSlashIcon weight="fill" />
            Mute
          </SwipeAction>
          <SwipeAction variant="archive">
            <ArchiveIcon weight="fill" />
            Archive
          </SwipeAction>
          <SwipeAction variant="destructive">
            <TrashIcon weight="fill" />
            Delete
          </SwipeAction>
        </SwipeActionsActions>
      </SwipeActions>
    </div>
  ),
}
