import { within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ItemAsLink from "@/examples/item-as-link"
import ItemDemo from "@/examples/item-demo"
import ItemWithAvatar from "@/examples/item-with-avatar"
import ItemWithHeaderAndFooter from "@/examples/item-with-header-and-footer"
import ItemWithImage from "@/examples/item-with-image"
import { renderExample } from "@/tests/render-example"

const NOTIFICATION_SETTINGS = /^Notification settings/

test("Default", async () => {
  const { canvas, step } = await renderExample(<ItemDemo />)

  await step("shows the title, description and action", async () => {
    await expect(canvas.getByText("Two-factor authentication")).toBeVisible()
    await expect(
      canvas.getByText("Add an extra layer of security to your account.")
    ).toBeVisible()
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Enable" })).toHaveFocus()
  })
})
test("As Link", async () => {
  const { canvas, step } = await renderExample(<ItemAsLink />)

  await step("renders the whole item as one focusable link", async () => {
    const link = canvas.getByRole("link", { name: NOTIFICATION_SETTINGS })
    await expect(link).toHaveAttribute("href", "#notifications")
    await userEvent.tab()
    await expect(link).toHaveFocus()
  })
})
test("With Image", async () => {
  const { canvas, step } = await renderExample(<ItemWithImage />)

  await step("exposes the people as a list", async () => {
    const list = canvas.getByRole("list")
    await expect(within(list).getAllByRole("listitem")).toHaveLength(3)
    await expect(
      canvas.getAllByRole("button", { name: "Invite" })
    ).toHaveLength(3)
  })
})
test("With Avatar", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <ItemWithAvatar />
  )

  await step("shows the avatar beside the name and status", async () => {
    await expect(
      canvasElement.querySelector('[data-slot="avatar"]')
    ).toBeInTheDocument()
    await expect(canvas.getByText("Olivia Martin")).toBeVisible()
    await expect(canvas.getByText("Last seen 5 minutes ago")).toBeVisible()
  })

  await step("reaches the action from the keyboard", async () => {
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Message" })).toHaveFocus()
  })
})
test("With Header And Footer", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <ItemWithHeaderAndFooter />
  )

  await step("splits the content into header and footer", async () => {
    await expect(
      canvasElement.querySelector('[data-slot="item-header"]')
    ).toHaveTextContent("Pro plan$24/mo")
    await expect(
      canvasElement.querySelector('[data-slot="item-footer"]')
    ).toContainElement(canvas.getByRole("button", { name: "Manage" }))
    await expect(canvas.getByText("Renews on May 1")).toBeVisible()
  })

  await step("reaches the footer action from the keyboard", async () => {
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Manage" })).toHaveFocus()
  })
})
