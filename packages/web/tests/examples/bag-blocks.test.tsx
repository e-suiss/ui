import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { BagCheckout } from "@/components/blocks/bag-checkout"
import { BagConfigure } from "@/components/blocks/bag-configure"
import { BagReview } from "@/components/blocks/bag-review"
import { renderExample } from "@/tests/render-example"

const TO_BAG = /to Bag/

test("Review", async () => {
  const { canvas, step } = await renderExample(<BagReview />)

  const heading = canvas.getByRole("heading", { level: 1 })

  await step("raising a quantity updates the total", async () => {
    await expect(heading).toHaveTextContent("Your bag total is $1,746.00.")
    const pods = canvas.getByRole("textbox", { name: "Pods Studio quantity" })
    const row = pods.closest("li")
    if (!(row instanceof HTMLElement)) throw new Error("Missing bag row")
    await userEvent.click(within(row).getByRole("button", { name: "Increase" }))
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
})
test("Checkout", async () => {
  const { canvas, step } = await renderExample(<BagCheckout />)

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
})
test("Configure", async () => {
  const { canvas, step } = await renderExample(<BagConfigure />)

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
})
