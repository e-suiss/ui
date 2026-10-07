import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { RolesEditor } from "@/components/blocks/roles-editor"
import { RolesMatrix } from "@/components/blocks/roles-matrix"
import { RolesRequests } from "@/components/blocks/roles-requests"

const meta = {
  title: "Blocks/Roles",
  component: RolesMatrix,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RolesMatrix>

export default meta

type Story = StoryObj<typeof meta>

const SAVE_ACTION = /^Save(d)?$/

export const Matrix: Story = {
  play: async ({ canvas, step }) => {
    const save = canvas.getByRole("button", { name: SAVE_ACTION })

    await step("toggling a permission enables save", async () => {
      await expect(save).toBeDisabled()
      const permission = canvas.getByRole("checkbox", {
        name: "Content Delete for Editor",
      })
      await userEvent.click(permission)
      await expect(permission).toHaveAttribute("aria-checked", "true")
      await waitFor(() => expect(save).toBeEnabled())
    })

    await step("saving confirms the change", async () => {
      await userEvent.click(save)
      await expect(save).toHaveTextContent("Saved")
      await expect(save).toBeDisabled()
    })
  },
}

export const Editor: Story = {
  render: () => <RolesEditor />,
  play: async ({ canvas, step }) => {
    await step("toggling a permission offers save and revert", async () => {
      await expect(canvas.queryByRole("button", { name: "Save" })).toBeNull()
      const permission = canvas.getByRole("switch", { name: "Delete" })
      await userEvent.click(permission)
      await expect(permission).toHaveAttribute("aria-checked", "true")
      await expect(
        await canvas.findByRole("button", { name: "Save" })
      ).toBeEnabled()
    })

    await step("reverting restores the permission", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Revert" }))
      await expect(
        canvas.getByRole("switch", { name: "Delete" })
      ).toHaveAttribute("aria-checked", "false")
      await waitFor(() =>
        expect(canvas.queryByRole("button", { name: "Save" })).toBeNull()
      )
    })
  },
}

export const Requests: Story = {
  render: () => <RolesRequests />,
  play: async ({ canvas, step }) => {
    await step("approving a request removes it from the queue", async () => {
      await expect(canvas.getByText("4 pending requests")).toBeInTheDocument()
      const row = canvas.getByText("Morgan Lee").closest("li")
      if (!(row instanceof HTMLElement)) throw new Error("Missing request")
      await userEvent.click(
        within(row).getByRole("button", { name: "Approve" })
      )
      await expect(within(row).getByRole("status")).toHaveTextContent(
        "Approved"
      )
      await expect(
        await canvas.findByText("3 pending requests")
      ).toBeInTheDocument()
    })
  },
}
