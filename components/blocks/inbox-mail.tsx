"use client"

import {
  ArchiveIcon,
  ArrowBendUpLeftIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  PaperPlaneTiltIcon,
  StarIcon,
  TrashIcon,
  TrayIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  hue: number
  unread: boolean
  starred: boolean
}

const initialMail: Mail[] = [
  {
    id: 0,
    from: "suiss",
    subject: "Your order has shipped",
    body: "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.",
    time: "9:12 AM",
    hue: 0,
    unread: true,
    starred: false,
  },
  {
    id: 1,
    from: "Morgan Lee",
    subject: "Tomorrow's meeting",
    body: "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.",
    time: "8:40 AM",
    hue: 30,
    unread: true,
    starred: false,
  },
  {
    id: 2,
    from: "suiss Cloud",
    subject: "Your storage is almost full",
    body: "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.",
    time: "Yesterday",
    hue: 210,
    unread: true,
    starred: false,
  },
  {
    id: 3,
    from: "Riley Chen",
    subject: "Coast trip photos",
    body: "I added the photos to the shared album. The ones from the boat tour came out great.",
    time: "Yesterday",
    hue: 150,
    unread: false,
    starred: true,
  },
  {
    id: 4,
    from: "suiss Store",
    subject: "Just for you: a Trade In offer",
    body: "Bring in your old phone and get up to $650 off a new one.",
    time: "Monday",
    hue: 0,
    unread: false,
    starred: false,
  },
  {
    id: 5,
    from: "App Store",
    subject: "Your receipt",
    body: "Your Studio Pro subscription renewed. Total: $4.99.",
    time: "Monday",
    hue: 0,
    unread: false,
    starred: false,
  },
]

const mailboxes = [
  { value: "Inbox", icon: TrayIcon },
  { value: "Starred", icon: StarIcon },
  { value: "Sent", icon: PaperPlaneTiltIcon },
  { value: "Archive", icon: ArchiveIcon },
  { value: "Trash", icon: TrashIcon },
]

function SenderAvatar({ mail, className }: { mail: Mail; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={
          mail.hue
            ? {
                background: `linear-gradient(160deg, oklch(0.78 0.1 ${mail.hue}), oklch(0.6 0.14 ${mail.hue + 30}))`,
              }
            : undefined
        }
        className="bg-none bg-label text-white normal-case dark:bg-none dark:bg-label dark:text-surface"
      >
        {mail.hue
          ? mail.from
              .split(" ")
              .map((part) => part[0])
              .join("")
          : "s"}
      </AvatarFallback>
    </Avatar>
  )
}

function Reader({
  mail,
  onStar,
  onRemove,
}: {
  mail: Mail
  onStar: () => void
  onRemove: () => void
}) {
  const [replying, setReplying] = React.useState(false)
  const [reply, setReply] = React.useState("")

  const actions = [
    {
      label: "Reply",
      icon: ArrowBendUpLeftIcon,
      onClick: () => setReplying(true),
    },
    {
      label: mail.starred ? "Unstar" : "Star",
      icon: StarIcon,
      onClick: onStar,
      active: mail.starred,
    },
    { label: "Archive", icon: ArchiveIcon, onClick: onRemove },
    { label: "Delete", icon: TrashIcon, onClick: onRemove },
  ]

  return (
    <div key={mail.id} className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12.5 shrink-0 items-center justify-end gap-0.5 border-b border-separator max-md:-mx-4 max-md:px-2 md:-mx-8 md:-mt-8 md:px-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="icon"
            aria-label={action.label}
            aria-pressed={action.active}
            onClick={action.onClick}
            data-active={action.active ? "" : undefined}
            className="text-label-secondary data-active:text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:data-active:text-orange"
          >
            <action.icon
              weight={action.active ? "fill" : "regular"}
              className="size-4.5"
            />
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-4 pt-5.5 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
        <div className="flex items-center gap-3">
          <SenderAvatar mail={mail} className="size-10" />
          <div className="flex flex-1 flex-col">
            <span className="text-base font-semibold">{mail.from}</span>
            <span className="text-xs text-label-secondary">
              To: Jamie Rivera
            </span>
          </div>
          <span className="text-xs text-label-secondary">{mail.time}</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          {mail.subject}
        </h3>
        <p className="text-base leading-relaxed">{mail.body}</p>
      </div>
      {replying && (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setReplying(false)
            setReply("")
          }}
          className="mt-5.5 flex flex-col gap-2.5 border-t border-separator pt-4.5 transition-[opacity,translate] duration-800 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
        >
          <Textarea
            autoFocus
            rows={4}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder={`Reply to ${mail.from}`}
            aria-label={`Reply to ${mail.from}`}
          />
          <div className="flex gap-2.5">
            <Button type="submit" size="sm" disabled={!reply}>
              Send
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setReplying(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export function InboxMail() {
  const [mail, setMail] = React.useState(initialMail)
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [selected, setSelected] = React.useState<number | null>(0)
  const [query, setQuery] = React.useState("")
  const unread = mail.filter((item) => item.unread).length
  const starred = mail.filter((item) => item.starred).length
  const counts: Record<string, number> = { Inbox: unread, Starred: starred }
  const list = mail.filter(
    (item) =>
      (mailbox !== "Starred" || item.starred) &&
      (!query ||
        `${item.from} ${item.subject} ${item.body}`
          .toLowerCase()
          .includes(query.toLowerCase()))
  )
  const current = mail.find((item) => item.id === selected)

  const update = (id: number, patch: Partial<Mail>) =>
    setMail((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const remove = (id: number) => {
    const rest = mail.filter((item) => item.id !== id)
    setMail(rest)
    setSelected(rest[0]?.id ?? null)
  }

  return (
    <SplitView
      defaultColumn="list"
      className="h-155 rounded-none border-0 max-md:h-auto max-md:min-h-155 max-md:p-4"
    >
      <SplitViewSidebar
        title="Mailboxes"
        className="min-h-full md:bg-surface-secondary"
      >
        {mailboxes.map((box) => (
          <SplitViewItem
            key={box.value}
            isActive={mailbox === box.value}
            onClick={() => setMailbox(box.value)}
          >
            <span className="flex items-center gap-2.5">
              <box.icon className="size-4.5 text-accent" />
              <span className="flex-1">{box.value}</span>
              <span className="text-xs text-label-secondary tabular-nums">
                {counts[box.value] || ""}
              </span>
            </span>
          </SplitViewItem>
        ))}
      </SplitViewSidebar>
      <SplitViewList title={mailbox} className="gap-2 md:px-2 md:pt-3">
        <div className="flex items-center gap-2 md:px-1">
          <div className="flex flex-1 flex-col max-md:hidden">
            <span className="text-lg font-semibold">{mailbox}</span>
            <span className="text-2xs text-label-secondary">
              {unread ? `${unread} unread` : "All read"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="New message"
            className="text-label-secondary max-md:ms-auto max-md:-mt-12"
          >
            <NotePencilIcon className="size-4.5" />
          </Button>
        </div>
        <InputGroup className="h-8 shrink-0 md:mx-1">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search mail"
            className="text-sm"
          />
        </InputGroup>
        <div className="flex flex-col gap-0.5">
          {list.length > 0 ? (
            list.map((item) => (
              <SplitViewItem
                key={item.id}
                isActive={item.id === selected}
                onClick={() => {
                  setSelected(item.id)
                  update(item.id, { unread: false })
                }}
                className="group/mail relative py-2.5 ps-6 md:data-active:bg-accent md:data-active:text-on-accent"
              >
                {item.unread && (
                  <span className="absolute inset-s-2.5 top-4.25 size-2 rounded-full bg-accent md:group-data-active/mail:bg-on-accent">
                    <span className="sr-only">Unread</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="flex-1 truncate text-sm font-semibold">
                    {item.from}
                  </span>
                  {item.starred && (
                    <StarIcon
                      weight="fill"
                      aria-label="Starred"
                      className="size-3 text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] md:group-data-active/mail:text-on-accent dark:text-orange"
                    />
                  )}
                  <span className="text-xs text-label-secondary md:group-data-active/mail:text-on-accent">
                    {item.time}
                  </span>
                </span>
                <span className="truncate text-sm">{item.subject}</span>
                <span className="line-clamp-2 text-xs leading-snug text-label-secondary md:group-data-active/mail:text-on-accent">
                  {item.body}
                </span>
              </SplitViewItem>
            ))
          ) : (
            <p className="p-6 text-center text-sm text-label-secondary">
              No Results
            </p>
          )}
        </div>
      </SplitViewList>
      <SplitViewDetail title={current?.subject} className="[&>h2]:sr-only">
        {current ? (
          <Reader
            mail={current}
            onStar={() => update(current.id, { starred: !current.starred })}
            onRemove={() => remove(current.id)}
          />
        ) : (
          <p className="m-auto text-label-secondary">No Message Selected</p>
        )}
      </SplitViewDetail>
    </SplitView>
  )
}
