import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { InboxCategories } from "@/components/blocks/inbox-categories"
import { InboxMail } from "@/components/blocks/inbox-mail"
import { InboxSupport } from "@/components/blocks/inbox-support"

const meta = {
  title: "Blocks/Inbox",
  component: InboxMail,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InboxMail>

export default meta

type Story = StoryObj<typeof meta>

const MEETING_ROW = /Tomorrow's meeting/
const STORAGE_ROW = /Your storage is almost full/
const PENDING_VIEW = /^Pending/
const BATTERY_TICKET = /Battery drains fast/
const PODS_TICKET = /Pods won.t pair/

export const Mail: Story = {
  play: async ({ canvas, step }) => {
    await step("opening a message shows it in the reader", async () => {
      const row = canvas.getByRole("button", { name: MEETING_ROW })
      await userEvent.click(row)
      await expect(row).toHaveAttribute("aria-current", "true")
      await expect(
        await canvas.findByRole("heading", {
          level: 3,
          name: "Tomorrow's meeting",
        })
      ).toBeInTheDocument()
    })

    await step("starring the open message marks it starred", async () => {
      const star = canvas.getAllByRole("button", { name: "Star" }).at(-1)
      if (!star) throw new Error("Missing star action")
      await userEvent.click(star)
      const unstar = canvas.getAllByRole("button", { name: "Unstar" }).at(-1)
      await expect(unstar).toHaveAttribute("aria-pressed", "true")
      await expect(
        within(
          canvas.getByRole("button", { name: MEETING_ROW })
        ).getByLabelText("Starred")
      ).toBeInTheDocument()
    })
  },
}

export const Categories: Story = {
  render: () => <InboxCategories />,
  play: async ({ canvas, step }) => {
    await step("picking a category opens its first message", async () => {
      const group = canvas.getByRole("group", { name: "Category" })
      const updates = within(group).getByRole("button", { name: "Updates" })
      await userEvent.click(updates)
      await expect(updates).toHaveAttribute("aria-pressed", "true")
      await expect(
        await canvas.findByRole("button", { name: STORAGE_ROW })
      ).toHaveAttribute("aria-current", "true")
      await expect(
        canvas.getByRole("heading", {
          level: 3,
          name: "Your storage is almost full",
        })
      ).toBeInTheDocument()
    })
  },
}

export const Support: Story = {
  render: () => <InboxSupport />,
  play: async ({ canvas, step }) => {
    await step("marking a ticket solved updates its status", async () => {
      const group = canvas.getByRole("group", { name: "Status" })
      await expect(
        within(group).getByRole("button", { name: "Open" })
      ).toHaveAttribute("aria-pressed", "true")
      await userEvent.click(
        canvas.getByRole("button", { name: "Mark as solved" })
      )
      await waitFor(() =>
        expect(
          within(group).getByRole("button", { name: "Solved" })
        ).toHaveAttribute("aria-pressed", "true")
      )
    })

    await step("a view filters the ticket queue", async () => {
      const views = canvas.getByRole("region", { name: "Support" })
      const pending = within(views).getByRole("button", { name: PENDING_VIEW })
      await userEvent.click(pending)
      await expect(pending).toHaveAttribute("aria-current", "true")
      await expect(
        await canvas.findByRole("button", { name: BATTERY_TICKET })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(canvas.queryByRole("button", { name: PODS_TICKET })).toBeNull()
      )
    })
  },
}
