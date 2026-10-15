import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { InboxCategories } from "@/components/blocks/inbox-categories"
import { InboxMail } from "@/components/blocks/inbox-mail"
import { InboxSupport } from "@/components/blocks/inbox-support"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const MEETING_ROW = /Tomorrow's meeting/
const STORAGE_ROW = /Your storage is almost full/
const PENDING_VIEW = /^Pending/
const BATTERY_TICKET = /Battery drains fast/
const PODS_TICKET = /Pods won.t pair/

test("Mail", async () => {
  const { canvas, step } = await renderExample(<InboxMail />)

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
      within(canvas.getByRole("button", { name: MEETING_ROW })).getByLabelText(
        "Starred"
      )
    ).toBeInTheDocument()
  })
})
test("Categories", async () => {
  const { canvas, step } = await renderExample(<InboxCategories />)

  await step("picking a category opens its first message", async () => {
    const group = canvas.getByRole(SINGLE.group, { name: "Category" })
    const updates = within(group).getByRole(SINGLE.role, { name: "Updates" })
    await userEvent.click(updates)
    await expect(updates).toHaveAttribute(SINGLE.pressed, "true")
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
})
test("Support", async () => {
  const { canvas, step } = await renderExample(<InboxSupport />)

  await step("marking a ticket solved updates its status", async () => {
    const group = canvas.getByRole(SINGLE.group, { name: "Status" })
    await expect(
      within(group).getByRole(SINGLE.role, { name: "Open" })
    ).toHaveAttribute(SINGLE.pressed, "true")
    await userEvent.click(
      canvas.getByRole("button", { name: "Mark as solved" })
    )
    await waitFor(() =>
      expect(
        within(group).getByRole(SINGLE.role, { name: "Solved" })
      ).toHaveAttribute(SINGLE.pressed, "true")
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
})
