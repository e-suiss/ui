import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SplitViewDemo from "@/examples/split-view-demo"
import SplitViewStartOnSidebar from "@/examples/split-view-start-on-sidebar"
import SplitViewTwoColumns from "@/examples/split-view-two-columns"
import { renderExample } from "@/tests/render-example"

const JORDAN = /Jordan Lee/
const CLOUD = /Cloud Drive/
const ACME = /Acme Store/

test("Default", async () => {
  const { canvas, step } = await renderExample(<SplitViewDemo />)

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
})
test("Two Columns", async () => {
  const { canvas, step } = await renderExample(<SplitViewTwoColumns />)

  await step("leaves out the sidebar", async () => {
    await expect(canvas.queryByRole("region", { name: "Mailboxes" })).toBeNull()
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
})
test("Start On Sidebar", async () => {
  const { canvas, step } = await renderExample(<SplitViewStartOnSidebar />)

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
})
