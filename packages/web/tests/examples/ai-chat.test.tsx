import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ChatDemo from "@/examples/chat-demo"
import { renderExample } from "@/tests/render-example"

const RAN_PNPM_BUILD = /Ran pnpm build/
const COMPILED = /Compiled successfully/
const FALLBACK = /only knows the scripted turns/

test("Chat", async () => {
  const { canvas, step } = await renderExample(<ChatDemo />)

  await step("renders the scripted turns", async () => {
    await expect(
      canvas.getByText("Run the build before I ship it.")
    ).toBeVisible()
    await expect(
      canvas.getByText("The build passes, so it is ready to ship.")
    ).toBeInTheDocument()
  })

  await step("expands a tool call", async () => {
    const trigger = canvas.getByRole("button", { name: RAN_PNPM_BUILD })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(await canvas.findByText(COMPILED)).toBeInTheDocument()
  })

  await step("sends a message with Enter", async () => {
    const send = canvas.getByRole("button", { name: "Send" })
    await expect(send).toBeDisabled()
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Message" }),
      "Ship it{Enter}"
    )
    await expect(await canvas.findByText("Ship it")).toBeInTheDocument()
    await expect(canvas.getByText(FALLBACK)).toBeInTheDocument()
  })

  await step("resets the conversation", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Reset conversation" })
    )
    await waitFor(() => expect(canvas.queryByText("Ship it")).toBeNull())
  })
})
