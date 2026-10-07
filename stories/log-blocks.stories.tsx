import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { LogActivity } from "@/components/blocks/log-activity"
import { LogLive } from "@/components/blocks/log-live"
import { LogSecurity } from "@/components/blocks/log-security"

const meta = {
  title: "Blocks/Log",
  component: LogActivity,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LogActivity>

export default meta

type Story = StoryObj<typeof meta>

export const Activity: Story = {
  play: async ({ canvas, step }) => {
    await step("filtering by type narrows the events", async () => {
      await expect(canvas.getByText("Price: Phone Pro")).toBeInTheDocument()
      await userEvent.click(canvas.getByRole("combobox", { name: "Type" }))
      await userEvent.click(
        await screen.findByRole("option", { name: "Order" })
      )
      await waitFor(() =>
        expect(canvas.queryByText("Price: Phone Pro")).toBeNull()
      )
      await expect(canvas.getByText("Order W1044 · $999")).toBeInTheDocument()
    })
  },
}

export const Live: Story = {
  render: () => <LogLive />,
  play: async ({ canvas, step }) => {
    await step("pausing stops the feed", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Pause" }))
      await expect(
        await canvas.findByRole("button", { name: "Resume" })
      ).toBeVisible()
      await expect(canvas.getByText("Paused")).toBeInTheDocument()
      await expect(canvas.queryByText("Live", { exact: true })).toBeNull()
    })

    await step("resuming restarts it", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Resume" }))
      await expect(
        await canvas.findByText("Events appear as they happen")
      ).toBeInTheDocument()
      await expect(canvas.getByRole("button", { name: "Pause" })).toBeVisible()
    })
  },
}

export const Security: Story = {
  render: () => <LogSecurity />,
  play: async ({ canvas, step }) => {
    await step("resolving an alert lowers the open count", async () => {
      await expect(canvas.getByText("4 open alerts")).toBeInTheDocument()
      const alert = canvas
        .getByText("Sign-in from an unusual location")
        .closest("li")
      if (!(alert instanceof HTMLElement)) throw new Error("Missing alert")
      await userEvent.click(
        within(alert).getByRole("button", { name: "Resolve" })
      )
      await expect(await canvas.findByText("3 open alerts")).toBeInTheDocument()
    })
  },
}
