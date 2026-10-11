// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"

const JORDAN = /Jordan Lee/
const CLOUD = /Cloud Drive/
const ACME = /Acme Store/

const mailboxes = ["Inbox", "Sent", "Drafts", "Archive"]

const messages = [
  {
    id: "order",
    from: "Acme Store",
    time: "09:12",
    subject: "Your order has shipped",
    body: "Order #1042 will be delivered tomorrow. Tracking number: 4815 1623 42.",
  },
  {
    id: "meeting",
    from: "Jordan Lee",
    time: "Yesterday",
    subject: "Tomorrow's meeting",
    body: "Does 10:00 work for you? On the agenda: the Q4 budget and the campaign plan.",
  },
  {
    id: "storage",
    from: "Cloud Drive",
    time: "Mon",
    subject: "Your storage is almost full",
    body: "Your cloud storage is 90% full. Upgrade your plan to get more space.",
  },
] as const

function MailExample({
  withSidebar = true,
  defaultColumn,
}: {
  withSidebar?: boolean
  defaultColumn?: "sidebar" | "list" | "detail"
}) {
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [messageId, setMessageId] = React.useState("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView
      defaultColumn={defaultColumn}
      className="h-[34rem] max-md:h-auto"
    >
      {withSidebar && (
        <SplitViewSidebar title="Mailboxes">
          {mailboxes.map((name) => (
            <SplitViewItem
              key={name}
              isActive={mailbox === name}
              onClick={() => setMailbox(name)}
            >
              {name}
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
      )}
      <SplitViewList title={mailbox}>
        {messages.map((item) => (
          <SplitViewItem
            key={item.id}
            isActive={item.id === messageId}
            onClick={() => setMessageId(item.id)}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-semibold">{item.from}</span>
              <span className="shrink-0 text-sm text-label-secondary">
                {item.time}
              </span>
            </span>
            <span className="truncate">{item.subject}</span>
            <span className="truncate text-sm text-label-secondary">
              {item.body}
            </span>
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message.subject}>
        <p className="text-sm text-label-secondary">
          {message.from} · {message.time}
        </p>
        <p className="mt-6 text-base">{message.body}</p>
      </SplitViewDetail>
    </SplitView>
  )
}

const meta = {
  title: "Patterns/Split View",
  component: SplitView,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SplitView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <MailExample />,
  play: async ({ canvas, step }) => {
    await step(
      "shows the three columns with the first message open",
      async () => {
        await expect(
          canvas.getByRole("region", { name: "Mailboxes" })
        ).toBeVisible()
        await expect(
          canvas.getByRole("region", { name: "Inbox" })
        ).toBeInTheDocument()
        await expect(
          canvas.getByRole("region", { name: "Your order has shipped" })
        ).toBeVisible()
      }
    )

    await step("switches the mailbox from the sidebar", async () => {
      const drafts = canvas.getByRole("button", { name: "Drafts" })
      await userEvent.click(drafts)
      await expect(drafts).toHaveAttribute("aria-current", "true")
      await expect(
        canvas.getByRole("region", { name: "Drafts" })
      ).toBeInTheDocument()
      await expect(
        canvas.getByRole("button", { name: "Inbox" })
      ).not.toHaveAttribute("aria-current")
    })

    await step("opens a message in the detail column", async () => {
      const message = canvas.getByRole("button", { name: JORDAN })
      await userEvent.click(message)
      await expect(message).toHaveAttribute("aria-current", "true")
      await waitFor(() =>
        expect(
          canvas.getByRole("region", { name: "Tomorrow's meeting" })
        ).toHaveTextContent("Does 10:00 work for you?")
      )
      await expect(
        canvas.getByRole("button", { name: ACME })
      ).not.toHaveAttribute("aria-current")
    })
  },
}

export const TwoColumns: Story = {
  render: () => <MailExample withSidebar={false} />,
  play: async ({ canvas, step }) => {
    await step("leaves out the sidebar", async () => {
      await expect(
        canvas.queryByRole("region", { name: "Mailboxes" })
      ).toBeNull()
      await expect(canvas.queryByRole("button", { name: "Drafts" })).toBeNull()
    })

    await step("opens a message next to the list", async () => {
      await userEvent.click(canvas.getByRole("button", { name: CLOUD }))
      await waitFor(() =>
        expect(
          canvas.getByRole("region", { name: "Your storage is almost full" })
        ).toHaveTextContent("Your cloud storage is 90% full.")
      )
    })
  },
}

export const StartOnSidebar: Story = {
  render: () => <MailExample defaultColumn="sidebar" />,
  play: async ({ canvas, step }) => {
    await step("shows every column on desktop", async () => {
      await expect(
        canvas.getByRole("region", { name: "Mailboxes" })
      ).toBeVisible()
      await expect(canvas.getByRole("region", { name: "Inbox" })).toBeVisible()
      await expect(
        canvas.getByRole("region", { name: "Your order has shipped" })
      ).toBeVisible()
    })

    await step("switches the mailbox from the sidebar", async () => {
      const archive = canvas.getByRole("button", { name: "Archive" })
      await userEvent.click(archive)
      await expect(archive).toHaveAttribute("aria-current", "true")
      await expect(
        canvas.getByRole("region", { name: "Archive" })
      ).toBeInTheDocument()
    })

    await step("opens a message in the detail column", async () => {
      await userEvent.click(canvas.getByRole("button", { name: CLOUD }))
      await waitFor(() =>
        expect(
          canvas.getByRole("region", { name: "Your storage is almost full" })
        ).toHaveTextContent("Your cloud storage is 90% full.")
      )
      await expect(
        canvas.getByRole("button", { name: ACME })
      ).not.toHaveAttribute("aria-current")
    })
  },
}
