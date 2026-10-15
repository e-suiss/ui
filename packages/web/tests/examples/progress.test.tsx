import { expect, test } from "vitest"
import ProgressComplete from "@/examples/progress-complete"
import ProgressDemo from "@/examples/progress-demo"
import ProgressIndeterminate from "@/examples/progress-indeterminate"
import ProgressWithLabel from "@/examples/progress-with-label"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ProgressDemo />)

  await step("exposes the current value", async () => {
    await expect(
      canvas.getByRole("progressbar", { name: "Upload progress" })
    ).toHaveAttribute("aria-valuenow", "60")
  })
})
test("With Label", async () => {
  const { canvas, step } = await renderExample(<ProgressWithLabel />)

  await step("names the bar and shows the value", async () => {
    const bar = canvas.getByRole("progressbar", { name: "Uploading files" })
    await expect(bar).toHaveAttribute("aria-valuenow", "42")
    await expect(bar).toHaveTextContent("42")
  })
})
test("Complete", async () => {
  const { canvas, step } = await renderExample(<ProgressComplete />)

  await step("reports a full bar", async () => {
    const bar = canvas.getByRole("progressbar", { name: "Uploading files" })
    await expect(bar).toHaveAttribute("aria-valuenow", "100")
    await expect(bar).toHaveTextContent("100")
  })
})
test("Indeterminate", async () => {
  const { canvas, step } = await renderExample(<ProgressIndeterminate />)

  await step("omits the value while indeterminate", async () => {
    await expect(
      canvas.getByRole("progressbar", { name: "Preparing export" })
    ).not.toHaveAttribute("aria-valuenow")
  })
})
