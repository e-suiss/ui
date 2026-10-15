import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { FooterCompact } from "@/components/blocks/footer-compact"
import { FooterDirectory } from "@/components/blocks/footer-directory"
import { FooterServices } from "@/components/blocks/footer-services"
import { renderExample } from "@/tests/render-example"

test("Directory", async () => {
  const { canvas, step } = await renderExample(<FooterDirectory />)

  await step("shows the breadcrumb and the directory links", async () => {
    const breadcrumb = canvas.getByRole("navigation", { name: "breadcrumb" })
    await expect(
      within(breadcrumb).getByRole("link", { name: "Phone" })
    ).toHaveAttribute("href", "#phone")
    const directory = canvas.getByRole("navigation", { name: "Directory" })
    await expect(
      within(directory).getByRole("link", { name: "Order Status" })
    ).toHaveAttribute("href", "#order-status")
    await expect(
      canvas.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "#privacy-policy")
  })
})
test("Compact", async () => {
  const { canvas, step } = await renderExample(<FooterCompact />)

  await step("expanding a section reveals its links", async () => {
    const wallet = canvas.getByRole("button", { name: "Wallet" })
    await expect(wallet).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(wallet)
    await expect(wallet).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(canvas.getByRole("link", { name: "suiss Pay" })).toBeVisible()
    )
  })

  await step("collapsing it hides them again", async () => {
    const wallet = canvas.getByRole("button", { name: "Wallet" })
    await userEvent.click(wallet)
    await expect(wallet).toHaveAttribute("aria-expanded", "false")
    await waitFor(() =>
      expect(canvas.queryByRole("link", { name: "suiss Pay" })).toBeNull()
    )
  })
})
test("Services", async () => {
  const { canvas, step } = await renderExample(<FooterServices />)

  const email = canvas.getByRole("textbox", { name: "Email address" })

  await step("an empty email is flagged", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }))
    await expect(email).toHaveAttribute("aria-invalid", "true")
  })

  await step("a valid email subscribes", async () => {
    await userEvent.type(email, "jamie@example.com")
    await expect(email).not.toHaveAttribute("aria-invalid")
    await userEvent.click(canvas.getByRole("button", { name: "Subscribe" }))
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "You're subscribed. Thank you."
    )
  })
})
