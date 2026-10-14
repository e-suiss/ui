import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { BagCheckout } from "@/components/blocks/bag-checkout"
import { BagConfigure } from "@/components/blocks/bag-configure"
import { BagReview } from "@/components/blocks/bag-review"

const meta = {
  title: "Blocks/Bag",
  component: BagReview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BagReview>

export default meta

type Story = StoryObj<typeof meta>

const TO_BAG = /to Bag/

export const Review: Story = {
  play: async ({ canvas, step }) => {
    const heading = canvas.getByRole("heading", { level: 1 })

    await step("raising a quantity updates the total", async () => {
      await expect(heading).toHaveTextContent("Your bag total is $1,746.00.")
      const pods = canvas.getByRole("textbox", { name: "Pods Studio quantity" })
      const row = pods.closest("li")
      if (!(row instanceof HTMLElement)) throw new Error("Missing bag row")
      await userEvent.click(
        within(row).getByRole("button", { name: "Increase" })
      )
      await waitFor(() => expect(pods).toHaveValue("2"))
      await expect(heading).toHaveTextContent("Your bag total is $2,295.00.")
    })

    await step("removing an item takes it off the total", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Remove Phone Pro" })
      )
      await waitFor(() =>
        expect(heading).toHaveTextContent("Your bag total is $1,196.00.")
      )
    })
  },
}

export const Checkout: Story = {
  render: () => <BagCheckout />,
  play: async ({ canvas, step }) => {
    const total = canvas
      .getByRole("complementary", { name: "Order summary" })
      .querySelector("[aria-live=polite]")

    await step("express delivery adds its fee to the total", async () => {
      await expect(total).toHaveTextContent("$1,697.00")
      await userEvent.click(canvas.getByText("Express · Tomorrow"))
      await waitFor(() => expect(total).toHaveTextContent("$1,716.00"))
    })

    await step("walks the steps and places the order", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Continue to Payment" })
      )
      await userEvent.click(
        await canvas.findByRole("button", { name: "Continue to Review" })
      )
      await userEvent.click(
        await canvas.findByRole("button", { name: "Place Order" })
      )
      await expect(
        await canvas.findByRole("heading", {
          name: "Thank you. Your order is in.",
        })
      ).toBeVisible()
    })
  },
}

export const Configure: Story = {
  render: () => <BagConfigure />,
  play: async ({ canvas, step }) => {
    const price = canvas.getByText("$1,099.00")

    await step("model and storage change the price", async () => {
      await userEvent.click(canvas.getByText("Phone Pro Max"))
      await waitFor(() => expect(price).toHaveTextContent("$1,199.00"))
      await userEvent.click(canvas.getByText("1 TB"))
      await waitFor(() => expect(price).toHaveTextContent("$1,599.00"))
    })

    await step("adds the configuration to the bag", async () => {
      await userEvent.click(canvas.getByRole("button", { name: TO_BAG }))
      await expect(
        canvas.getByRole("button", { name: TO_BAG })
      ).toHaveTextContent("Added to Bag")
    })
  },
}
