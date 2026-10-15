import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SliderDemo from "@/examples/slider-demo"
import SliderDisabled from "@/examples/slider-disabled"
import SliderRange from "@/examples/slider-range"
import SliderSteps from "@/examples/slider-steps"
import SliderVertical from "@/examples/slider-vertical"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const VALUE = byBase({
  base: "aria-valuenow",
  radix: "aria-valuenow",
  aria: "aria-valuetext",
})

test("Default", async () => {
  const { canvas, step } = await renderExample(<SliderDemo />)

  const slider = canvas.getByRole("slider", { name: "Volume" })

  await step("starts at the default value", async () => {
    await expect(slider).toHaveAttribute(VALUE, "50")
  })

  await step("moves with the arrow and edge keys", async () => {
    await userEvent.tab()
    await expect(slider).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(slider).toHaveAttribute(VALUE, "51")
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
    await expect(slider).toHaveAttribute(VALUE, "49")
    await userEvent.keyboard("{End}")
    await expect(slider).toHaveAttribute(VALUE, "100")
    await userEvent.keyboard("{Home}")
    await expect(slider).toHaveAttribute(VALUE, "0")
  })
})
test("Range", async () => {
  const { canvas, step } = await renderExample(<SliderRange />)

  const [start, end] = canvas.getAllByRole("slider", { name: "Price range" })

  await step("renders a thumb per value", async () => {
    await expect(start).toHaveAttribute(VALUE, "25")
    await expect(end).toHaveAttribute(VALUE, "75")
  })

  await step("moves each thumb independently", async () => {
    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")
    await userEvent.tab()
    await userEvent.keyboard("{ArrowLeft}")
    await expect(start).toHaveAttribute(VALUE, "26")
    await expect(end).toHaveAttribute(VALUE, "74")
  })
})
test("Steps", async () => {
  const { canvas, step } = await renderExample(<SliderSteps />)

  const slider = canvas.getByRole("slider", { name: "Brightness" })

  await step("moves by the step size", async () => {
    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")
    await expect(slider).toHaveAttribute(VALUE, "50")
  })
})
test("Vertical", async () => {
  const { canvas, step } = await renderExample(<SliderVertical />)

  const slider = canvas.getByRole("slider", { name: "Volume" })

  await step("runs vertically", async () => {
    await expect(slider).toHaveAttribute("aria-orientation", "vertical")
    await expect(slider).toHaveAttribute(VALUE, "50")
  })

  await step("moves with the up and down keys", async () => {
    await userEvent.tab()
    await expect(slider).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect(slider).toHaveAttribute(VALUE, "51")
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect(slider).toHaveAttribute(VALUE, "49")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<SliderDisabled />)

  const slider = canvas.getByRole("slider", { name: "Volume" })

  await step("stays out of the tab order and keeps its value", async () => {
    await byBase({
      base: () => expect(slider).toBeDisabled(),
      radix: () => expect(slider).toHaveAttribute("aria-disabled", "true"),
      aria: () => expect(slider).toBeDisabled(),
    })()
    await userEvent.tab()
    await expect(slider).not.toHaveFocus()
    await expect(slider).toHaveAttribute(VALUE, "50")
  })
})
