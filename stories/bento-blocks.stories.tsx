import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { BentoCloserLook } from "@/components/blocks/bento-closer-look"
import { BentoFeatures } from "@/components/blocks/bento-features"
import { BentoStats } from "@/components/blocks/bento-stats"

const meta = {
  title: "Blocks/Bento",
  component: BentoFeatures,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BentoFeatures>

export default meta

type Story = StoryObj<typeof meta>

export const Features: Story = {
  play: async ({ canvas, step }) => {
    await step("shows the feature tiles under the heading", async () => {
      await expect(
        canvas.getByRole("heading", { name: "Why Phone Pro?" })
      ).toBeVisible()
      await expect(canvas.getByText("S19 Pro")).toBeVisible()
      await expect(canvas.getByText("33 hrs")).toBeVisible()
      await expect(
        canvas.getByRole("img", { name: "A close-up of a camera lens" })
      ).toBeVisible()
    })
  },
}

export const Stats: Story = {
  render: () => <BentoStats />,
  play: async ({ canvas, step }) => {
    await step("fills the charge meter to half", async () => {
      await expect(
        canvas.getByRole("heading", { name: "50% in 20 minutes." })
      ).toBeVisible()
      const charge = canvas.getByRole("progressbar", {
        name: "Charge after 20 minutes",
      })
      await waitFor(() => expect(charge).toHaveAttribute("aria-valuenow", "50"))
    })
  },
}

export const CloserLook: Story = {
  render: () => <BentoCloserLook />,
  play: async ({ canvas, step }) => {
    await step("picking a feature opens it with its photo", async () => {
      const trigger = canvas.getByRole("button", { name: "Aluminum body" })
      await userEvent.click(trigger)
      await waitFor(() =>
        expect(trigger).toHaveAttribute("aria-expanded", "true")
      )
      await expect(
        canvas.getByRole("button", { name: "Camera Control" })
      ).toHaveAttribute("aria-expanded", "false")
      await expect(
        await canvas.findByText("A unibody design", { exact: false })
      ).toBeVisible()
    })
  },
}
