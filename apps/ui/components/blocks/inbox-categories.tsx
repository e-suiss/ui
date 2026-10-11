"use client"

import {
  ArchiveIcon,
  ArrowBendUpLeftIcon,
  BellIcon,
  CreditCardIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Category = "Primary" | "Transactions" | "Updates" | "Promotions"

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  hue: number
  category: Category
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
    category: "Transactions",
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
    category: "Primary",
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
    category: "Updates",
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
    category: "Primary",
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
    category: "Promotions",
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
    category: "Transactions",
    unread: false,
    starred: false,
  },
]

const categories: { value: Category; icon: React.ElementType; tint: string }[] =
  [
    { value: "Primary", icon: UsersIcon, tint: "aria-pressed:bg-accent" },
    {
      value: "Transactions",
      icon: CreditCardIcon,
      tint: "aria-pressed:bg-[color-mix(in_oklab,var(--green),var(--label)_40%)] dark:aria-pressed:bg-[color-mix(in_oklab,var(--green),black_40%)]",
    },
    {
      value: "Updates",
      icon: BellIcon,
      tint: "aria-pressed:bg-[color-mix(in_oklab,var(--purple),var(--label)_20%)] dark:aria-pressed:bg-[color-mix(in_oklab,var(--purple),black_30%)]",
    },
    {
      value: "Promotions",
      icon: TagIcon,
      tint: "aria-pressed:bg-[color-mix(in_oklab,var(--pink),var(--label)_20%)] dark:aria-pressed:bg-[color-mix(in_oklab,var(--pink),black_25%)]",
    },
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

export function InboxCategories() {
  const [mail, setMail] = React.useState(initialMail)
  const [category, setCategory] = React.useState<Category>("Primary")
  const [selected, setSelected] = React.useState<number | null>(1)
  const list = mail.filter((item) => item.category === category)
  const current = list.find((item) => item.id === selected)

  const update = (id: number, patch: Partial<Mail>) =>
    setMail((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const remove = (id: number) => {
    const rest = mail.filter((item) => item.id !== id)
    setMail(rest)
    setSelected(rest.find((item) => item.category === category)?.id ?? null)
  }

  return (
    <SplitView
      defaultColumn="list"
      className="h-155 rounded-none border-0 max-md:h-auto max-md:min-h-155 max-md:p-4"
    >
      <SplitViewList title="Inbox" className="gap-3 md:px-2 md:pt-4">
        <p className="text-3xl font-bold tracking-tight max-md:hidden md:px-1.5">
          Inbox
        </p>
        <ToggleGroup
          value={[category]}
          onValueChange={(value: string[]) => {
            const next = value[0] as Category | undefined
            if (!next) return
            setCategory(next)
            setSelected(mail.find((item) => item.category === next)?.id ?? null)
          }}
          aria-label="Category"
          spacing={1.5}
          className="md:px-1.5"
        >
          {categories.map((item) => {
            const unread = mail.some(
              (entry) => entry.category === item.value && entry.unread
            )
            const pressed = category === item.value
            return (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                aria-label={item.value}
                className={`relative h-8.5 gap-1.5 bg-control px-2.75 font-semibold text-label-secondary transition-[padding,background-color,color] duration-350 ease-[cubic-bezier(0.3,1.25,0.5,1)] hover:bg-control-hover aria-pressed:px-3.5 aria-pressed:text-white aria-pressed:hover:text-white ${item.tint}`}
              >
                <item.icon weight="bold" className="size-4" />
                {pressed && <span aria-hidden>{item.value}</span>}
                {!pressed && unread && (
                  <span className="absolute end-0.5 top-0.5 size-2 rounded-full bg-accent ring-2 ring-surface">
                    <span className="sr-only">Unread</span>
                  </span>
                )}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
        <div key={category} className="flex flex-col gap-0.5">
          {list.length > 0 ? (
            list.map((item, index) => (
              <SplitViewItem
                key={item.id}
                isActive={item.id === selected}
                onClick={() => {
                  setSelected(item.id)
                  update(item.id, { unread: false })
                }}
                style={{ transitionDelay: `${index * 40}ms` }}
                className="group/mail relative py-2.5 ps-6 transition-[opacity,translate] duration-700 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none md:data-active:bg-accent md:data-active:text-on-accent"
              >
                {item.unread && (
                  <span className="absolute start-2.5 top-4.25 size-2 rounded-full bg-accent md:group-data-active/mail:bg-on-accent">
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
            <p className="p-7.5 text-center text-sm text-label-secondary">
              No messages in {category}.
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
