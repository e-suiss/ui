import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ChartDemo from "@/examples/chart-demo"
import ChartDonut from "@/examples/chart-donut"
import ChartMultipleSeries from "@/examples/chart-multiple-series"
import { renderExample } from "@/tests/render-example"

const visitors = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<ChartDemo />)

  await step("draws a bar for every month", async () => {
    await expect(await canvas.findByText("Jan")).toBeVisible()
    await expect(canvas.getByText("Jun")).toBeVisible()
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".recharts-bar-rectangle")
      ).toHaveLength(visitors.length)
    )
  })

  await step("shows the tooltip from the keyboard", async () => {
    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() =>
      expect(screen.getByText("February")).toBeInTheDocument()
    )
    await expect(screen.getByText("Desktop")).toBeInTheDocument()
    await expect(screen.getByText("305")).toBeInTheDocument()
  })
})
test("Multiple Series", async () => {
  const { canvas } = await renderExample(<ChartMultipleSeries />)

  await expect(await canvas.findByText("Desktop")).toBeVisible()
  await expect(canvas.getByText("Mobile")).toBeVisible()
})
test("Donut", async () => {
  const { canvas } = await renderExample(<ChartDonut />)

  for (const label of ["Safari", "Chrome", "Firefox", "Edge", "Other"]) {
    await expect(await canvas.findByText(label)).toBeVisible()
  }
})
