import { within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import StepperDemo from "@/examples/stepper-demo"
import StepperPrint from "@/examples/stepper-print"
import { renderExample } from "@/tests/render-example"

function stepperOf(input: HTMLElement) {
  const stepper = input.closest<HTMLElement>("[data-slot=stepper]")
  if (!stepper) throw new Error("stepper not found")
  return within(stepper)
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<StepperDemo />)

  const input = canvas.getByRole("textbox", { name: "Quantity" })
  const decrease = canvas.getByRole("button", { name: "Decrease" })
  const increase = canvas.getByRole("button", { name: "Increase" })

  await step("decrements down to the minimum", async () => {
    await expect(input).toHaveValue("1")
    await userEvent.click(decrease)
    await expect(input).toHaveValue("0")
    await expect(decrease).toBeDisabled()
  })

  await step("increments up to the maximum", async () => {
    for (let count = 0; count < 10; count++) await userEvent.click(increase)
    await expect(input).toHaveValue("10")
    await expect(increase).toBeDisabled()
    await expect(decrease).toBeEnabled()
  })

  await step("steps with the arrow keys from the field", async () => {
    await userEvent.click(input)
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect(input).toHaveValue("8")
    await expect(increase).toBeEnabled()
  })
})
test("Print", async () => {
  const { canvas, step } = await renderExample(<StepperPrint />)

  const status = canvas.getByRole("status")
  const copies = canvas.getByRole("textbox", { name: "Copies" })
  const scale = canvas.getByRole("textbox", { name: "Scale" })
  const pages = canvas.getByRole("textbox", { name: "Pages per sheet" })

  await step("keeps copies at the minimum of one", async () => {
    await expect(status).toHaveTextContent("1 copy at 100%")
    await expect(
      stepperOf(copies).getByRole("button", { name: "Decrease" })
    ).toBeDisabled()
    await userEvent.click(
      stepperOf(copies).getByRole("button", { name: "Increase" })
    )
    await expect(status).toHaveTextContent("2 copies at 100%")
  })

  await step("steps the scale by five percent", async () => {
    const increase = stepperOf(scale).getByRole("button", {
      name: "Increase",
    })
    await userEvent.click(increase)
    await userEvent.click(increase)
    await expect(status).toHaveTextContent("2 copies at 110%")
  })

  await step("leaves the disabled row untouchable", async () => {
    await expect(pages).toBeDisabled()
    await expect(
      stepperOf(pages).getByRole("button", { name: "Increase" })
    ).toBeDisabled()
    await expect(
      stepperOf(pages).getByRole("button", { name: "Decrease" })
    ).toBeDisabled()
  })
})
