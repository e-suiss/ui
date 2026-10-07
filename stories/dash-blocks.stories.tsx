import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { DashAnalytics } from "@/components/blocks/dash-analytics"
import { DashHealth } from "@/components/blocks/dash-health"
import { DashStore } from "@/components/blocks/dash-store"

const meta = {
  title: "Blocks/Dashboard",
  component: DashStore,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DashStore>

export default meta

type Story = StoryObj<typeof meta>

const WALKING_SPEED = /^Walking Speed/

export const Store: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const headline = canvasElement.querySelector("[aria-live=polite]")

    await step("a longer range scales the revenue", async () => {
      await expect(headline).toHaveTextContent("Weekly sales$1,284,500")
      const range = canvas.getByRole("button", { name: "30 Days" })
      await userEvent.click(range)
      await waitFor(() =>
        expect(headline).toHaveTextContent("Weekly sales$5,523,350")
      )
      await expect(range).toHaveAttribute("aria-pressed", "true")
    })

    await step("a status filter narrows the recent orders", async () => {
      const orders = () => canvasElement.querySelectorAll("[role=listitem]")
      await expect(orders()).toHaveLength(5)
      await userEvent.click(canvas.getByRole("button", { name: "Delivered" }))
      await waitFor(() => expect(orders()).toHaveLength(2))
    })
  },
}

export const Health: Story = {
  render: () => <DashHealth />,
  play: async ({ canvas, step }) => {
    await step("pinning a metric adds it to the summary", async () => {
      await expect(
        canvas.queryByRole("link", { name: WALKING_SPEED })
      ).toBeNull()
      await userEvent.click(canvas.getByRole("button", { name: "Edit" }))
      await userEvent.click(
        await canvas.findByRole("button", { name: "Pin Walking Speed" })
      )
      await expect(
        await canvas.findByRole("button", { name: "Unpin Walking Speed" })
      ).toHaveAttribute("data-pinned")
      await userEvent.click(canvas.getByRole("button", { name: "Done" }))
      await waitFor(() =>
        expect(canvas.getByRole("link", { name: WALKING_SPEED })).toBeVisible()
      )
      await expect(
        canvas.queryByRole("button", { name: "Unpin Walking Speed" })
      ).toBeNull()
    })
  },
}

export const Analytics: Story = {
  render: () => <DashAnalytics />,
  play: async ({ canvas, canvasElement, step }) => {
    const headline = canvasElement.querySelector("[aria-live=polite]")

    await step("picking a metric switches the totals", async () => {
      await expect(headline).toHaveTextContent("This week · Downloads5.6 K")
      const revenue = canvas.getByRole("button", { name: "Revenue" })
      await userEvent.click(revenue)
      await waitFor(() =>
        expect(headline).toHaveTextContent("This week · Revenue21.0 K $")
      )
      await expect(revenue).toHaveAttribute("aria-pressed", "true")
    })

    await step("picking a section rescales its numbers", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Downloads" }))
      await userEvent.click(canvas.getByRole("button", { name: "Notebook" }))
      await waitFor(() =>
        expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
          "Notebook"
        )
      )
      await expect(headline).toHaveTextContent("This week · Downloads4.0 K")
    })
  },
}
