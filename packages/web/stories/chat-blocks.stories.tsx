import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { ChatConversations } from "@/components/blocks/chat-conversations"
import { ChatSupport } from "@/components/blocks/chat-support"
import { ChatThread } from "@/components/blocks/chat-thread"

const meta = {
  title: "Blocks/Chat",
  component: ChatConversations,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChatConversations>

export default meta

type Story = StoryObj<typeof meta>

const FAMILY_THREAD = /^\S+ Family/

export const Conversations: Story = {
  play: async ({ canvas, step }) => {
    await step("picking a thread opens its conversation", async () => {
      const family = canvas.getByRole("button", { name: FAMILY_THREAD })
      await userEvent.click(family)
      await waitFor(() =>
        expect(family).toHaveAttribute("aria-current", "true")
      )
      const region = await canvas.findByRole("region", {
        name: "Conversation with Family",
      })
      await expect(region).toBeVisible()
      await expect(
        within(region).getByText("I'll bring pastries")
      ).toBeInTheDocument()
    })

    await step("sending a message adds it and a reply follows", async () => {
      const composer = canvas.getByRole("textbox", { name: "Message" })
      await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
      await userEvent.type(composer, "See you Sunday{Enter}")
      await expect(composer).toHaveValue("")
      const region = canvas.getByRole("region", {
        name: "Conversation with Family",
      })
      await expect(
        await within(region).findByText("See you Sunday")
      ).toBeInTheDocument()
      await expect(
        await within(region).findByText("Sounds good", {}, { timeout: 4000 })
      ).toBeInTheDocument()
    })
  },
}

export const Thread: Story = {
  render: () => <ChatThread />,
  play: async ({ canvas, step }) => {
    await step("double-clicking a bubble adds a heart", async () => {
      await userEvent.dblClick(
        canvas.getByRole("button", {
          name: "Great, I'll bring the camera. Double-click to add a heart.",
        })
      )
      await expect(
        await canvas.findByRole("button", {
          name: "Great, I'll bring the camera, liked. Double-click to remove the heart.",
        })
      ).toBeInTheDocument()
    })

    await step("sending a message adds it to the thread", async () => {
      const composer = canvas.getByRole("textbox", { name: "Message" })
      await userEvent.type(composer, "See you Friday")
      await userEvent.click(canvas.getByRole("button", { name: "Send" }))
      await expect(composer).toHaveValue("")
      await expect(
        await canvas.findByText("See you Friday")
      ).toBeInTheDocument()
      await expect(
        await canvas.findByText("Sounds good", {}, { timeout: 4000 })
      ).toBeInTheDocument()
    })
  },
}

export const Support: Story = {
  render: () => <ChatSupport />,
  play: async ({ canvas, step }) => {
    await step("a quick question gets its scripted answer", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Book a repair" })
      )
      await expect(
        await canvas.findByText(
          "The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
          {},
          { timeout: 3000 }
        )
      ).toBeInTheDocument()
      await expect(
        canvas.queryByRole("button", { name: "Book a repair" })
      ).toBeNull()
    })

    await step("closing the chat returns to the launcher", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Close chat" }))
      const launcher = canvas.getByRole("button", { name: "Open chat" })
      await waitFor(() =>
        expect(launcher).toHaveAttribute("aria-expanded", "false")
      )
    })
  },
}
