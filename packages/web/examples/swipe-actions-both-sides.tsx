import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { Button } from "@/components/ui/button"

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

export default function SwipeActionsBothSides() {
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
                  <IconPlaceholder
                    lucide="MailIcon"
                    tabler="IconMail"
                    hugeicons="Mail01Icon"
                    phosphor="EnvelopeSimpleIcon"
                    remixicon="RiMailLine"
                  />
                  Unread
                </SwipeAction>
              </SwipeActionsActions>
              <SwipeActionsContent className="flex flex-col gap-0.5 px-4 py-3">
                <span className="flex items-center gap-2 font-semibold">
                  {unread.includes(message.id) && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                  {message.from}
                </span>
                <span className="text-sm">{message.subject}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {message.preview}
                </span>
              </SwipeActionsContent>
              <SwipeActionsActions>
                <SwipeAction
                  variant="archive"
                  onClick={() => remove(message.id, "Archived")}
                >
                  <IconPlaceholder
                    lucide="ArchiveIcon"
                    tabler="IconArchive"
                    hugeicons="Archive02Icon"
                    phosphor="ArchiveIcon"
                    remixicon="RiArchiveLine"
                  />
                  Archive
                </SwipeAction>
                <SwipeAction
                  variant="destructive"
                  fullSwipe
                  onClick={() => remove(message.id, "Deleted")}
                >
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="Delete02Icon"
                    phosphor="TrashIcon"
                    remixicon="RiDeleteBinLine"
                  />
                  Delete
                </SwipeAction>
              </SwipeActionsActions>
            </SwipeActions>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
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
