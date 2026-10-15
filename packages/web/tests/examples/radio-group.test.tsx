import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import RadioGroupDemo from "@/examples/radio-group-demo"
import RadioGroupDisabled from "@/examples/radio-group-disabled"
import RadioGroupDisabledItem from "@/examples/radio-group-disabled-item"
import RadioGroupInvalid from "@/examples/radio-group-invalid"
import RadioGroupWithDescriptions from "@/examples/radio-group-with-descriptions"
import { renderExample } from "@/tests/render-example"

const STANDARD = /^Standard/
const EXPRESS = /^Express/

test("Default", async () => {
  const { canvas, step } = await renderExample(<RadioGroupDemo />)

  const email = canvas.getByRole("radio", { name: "Email" })
  const sms = canvas.getByRole("radio", { name: "Text message" })

  await step("names the group and checks the default", async () => {
    await expect(
      canvas.getByRole("radiogroup", { name: "Notification method" })
    ).toBeVisible()
    await expect(email).toHaveAttribute("aria-checked", "true")
  })

  await step("selects with a click on the label", async () => {
    await userEvent.click(canvas.getByText("Text message"))
    await expect(sms).toHaveAttribute("aria-checked", "true")
    await expect(email).toHaveAttribute("aria-checked", "false")
  })

  await step("moves the selection with arrow keys", async () => {
    await userEvent.click(sms)
    await userEvent.keyboard("{ArrowDown}")
    const push = canvas.getByRole("radio", { name: "Push notification" })
    await expect(push).toHaveFocus()
    await expect(push).toHaveAttribute("aria-checked", "true")
  })
})
test("With Descriptions", async () => {
  const { canvas, step } = await renderExample(<RadioGroupWithDescriptions />)

  const standard = canvas.getByRole("radio", { name: STANDARD })
  const express = canvas.getByRole("radio", { name: EXPRESS })

  await step("names each option by its title and describes it", async () => {
    await expect(standard).toHaveAccessibleName("Standard")
    await expect(standard).toHaveAccessibleDescription(
      "Arrives in 4 to 6 business days."
    )
    await expect(express).toHaveAccessibleDescription(
      "Arrives in 1 to 2 business days."
    )
  })

  await step("shows each description inside its option", async () => {
    await expect(
      canvas.getByText("Arrives in 4 to 6 business days.").closest("label")
    ).toContainElement(standard)
    await expect(
      canvas.getByText("Arrives in 1 to 2 business days.").closest("label")
    ).toContainElement(express)
  })

  await step("selects an option from its description", async () => {
    await expect(standard).toHaveAttribute("aria-checked", "true")
    await userEvent.click(canvas.getByText("Arrives in 1 to 2 business days."))
    await expect(express).toHaveAttribute("aria-checked", "true")
    await expect(standard).toHaveAttribute("aria-checked", "false")
  })
})
test("Disabled Item", async () => {
  const { canvas, step } = await renderExample(<RadioGroupDisabledItem />)

  const push = canvas.getByRole("radio", { name: "Push notification" })

  await step("skips the disabled item", async () => {
    await userEvent.click(canvas.getByRole("radio", { name: "Text message" }))
    await userEvent.keyboard("{ArrowDown}")
    await expect(push).not.toHaveFocus()
    await expect(push).toHaveAttribute("aria-checked", "false")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<RadioGroupDisabled />)

  await step("ignores clicks while disabled", async () => {
    await userEvent.click(canvas.getByText("Text message"), {
      pointerEventsCheck: 0,
    })
    await expect(
      canvas.getByRole("radio", { name: "Text message" })
    ).toHaveAttribute("aria-checked", "false")
    await expect(canvas.getByRole("radio", { name: "Email" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<RadioGroupInvalid />)

  const radios = canvas.getAllByRole("radio")

  await step("marks every option as invalid with none chosen", async () => {
    await expect(radios).toHaveLength(3)
    for (const radio of radios) {
      await expect(radio).toBeInvalid()
      await expect(radio).toHaveAttribute("aria-checked", "false")
    }
  })

  await step("still accepts a choice", async () => {
    await userEvent.click(canvas.getByText("Text message"))
    await expect(
      canvas.getByRole("radio", { name: "Text message" })
    ).toHaveAttribute("aria-checked", "true")
  })
})
