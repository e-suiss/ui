import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { UsersDetail } from "@/components/blocks/users-detail"
import { UsersInvite } from "@/components/blocks/users-invite"
import { UsersTable } from "@/components/blocks/users-table"

const meta = {
  title: "Blocks/Users",
  component: UsersTable,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof UsersTable>

export default meta

type Story = StoryObj<typeof meta>

const REMOVE_CHIP = /^Remove /

export const List: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const rows = () => canvasElement.querySelectorAll("tbody tr")

    await step("a role filter narrows the people", async () => {
      await expect(rows()).toHaveLength(6)
      const roles = canvas.getByRole("group", { name: "Role" })
      await userEvent.click(
        within(roles).getByRole("button", { name: "Editor" })
      )
      await waitFor(() => expect(rows()).toHaveLength(2))
      await userEvent.click(within(roles).getByRole("button", { name: "All" }))
      await waitFor(() => expect(rows()).toHaveLength(6))
    })

    await step("selecting a row shows the bulk actions", async () => {
      await expect(canvas.queryByRole("button", { name: "Suspend" })).toBeNull()
      const box = canvas.getByRole("checkbox", { name: "Select Riley Chen" })
      await userEvent.click(box)
      await expect(box).toBeChecked()
      await expect(canvas.getByText("1 selected")).toBeInTheDocument()
      await expect(
        await canvas.findByRole("button", { name: "Suspend" })
      ).toBeVisible()
    })
  },
}

export const Detail: Story = {
  render: () => <UsersDetail />,
  play: async ({ canvas, step }) => {
    await step("picking a person opens their profile", async () => {
      const users = canvas.getByRole("region", { name: "Users" })
      const person = within(users)
        .getAllByRole("button")
        .find((button) => button.textContent?.includes("Taylor Kim"))
      if (!person) throw new Error("Missing Taylor Kim")
      await userEvent.click(person)
      await expect(person).toHaveAttribute("aria-current", "true")
      const detail = await canvas.findByRole("region", { name: "Taylor Kim" })
      await expect(
        within(detail).getByText("taylor@company.com · Viewer")
      ).toBeInTheDocument()
    })
  },
}

export const Invite: Story = {
  render: () => <UsersInvite />,
  play: async ({ canvas, step }) => {
    await step("typing an email adds an invitee", async () => {
      await userEvent.type(
        canvas.getByRole("textbox", { name: "Email" }),
        "morgan@company.com{Enter}"
      )
      await expect(
        await canvas.findByText("2 people will be invited as Editor.")
      ).toBeInTheDocument()
      await expect(
        canvas.getAllByRole("button", { name: REMOVE_CHIP })
      ).toHaveLength(2)
    })

    await step("sending lists them as pending", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Send Invites" })
      )
      await expect(
        await screen.findByText("2 invitations sent")
      ).toBeInTheDocument()
      await expect(
        canvas.getByRole("button", { name: "Send Invites" })
      ).toBeDisabled()
    })
  },
}
