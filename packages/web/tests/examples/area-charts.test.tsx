import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { AreaChartAxes } from "@/components/charts/area-chart-axes"
import { AreaChartDefault } from "@/components/charts/area-chart-default"
import { AreaChartGradient } from "@/components/charts/area-chart-gradient"
import { AreaChartInteractive } from "@/components/charts/area-chart-interactive"
import { AreaChartLinear } from "@/components/charts/area-chart-linear"
import { AreaChartRange } from "@/components/charts/area-chart-range"
import { AreaChartSparkline } from "@/components/charts/area-chart-sparkline"
import { AreaChartStacked } from "@/components/charts/area-chart-stacked"
import { AreaChartStackedExpand } from "@/components/charts/area-chart-stacked-expand"
import { AreaChartStep } from "@/components/charts/area-chart-step"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const DRAWN_PATH = /^M\s?-?\d/
const february = { month: "February", desktop: 305, mobile: 200 }
const april = { month: "April", desktop: 173, mobile: 190 }
async function expectSeries(
  root: HTMLElement,
  selector: string,
  count: number
) {
  await waitFor(() => {
    const shapes = Array.from(root.querySelectorAll(selector))
    expect(shapes).toHaveLength(count)
    for (const shape of shapes) {
      expect(shape.getAttribute("d")).toMatch(DRAWN_PATH)
    }
  })
}
async function focusPoint(root: HTMLElement, index: number) {
  const surface = await within(root).findByRole("application")
  surface.focus()
  for (let step = 0; step < index; step++) {
    await userEvent.keyboard("{ArrowRight}")
  }
}
async function expectTooltip(root: HTMLElement, texts: string[]) {
  await waitFor(() => {
    const tooltip = root.querySelector(".recharts-tooltip-wrapper")
    for (const text of texts) {
      expect(tooltip).toHaveTextContent(text)
    }
  })
}
async function expectLegend(root: HTMLElement, labels: string[]) {
  await waitFor(() => {
    const legend = root.querySelector(".recharts-legend-wrapper")
    for (const label of labels) {
      expect(legend).toHaveTextContent(label)
    }
  })
}

test("Interactive", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(60rem,calc(100vw-2rem))]">
      <AreaChartInteractive />
    </div>
  )

  await step("draws the price series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
  })

  await step("switches the time range", async () => {
    await expect(canvas.getByText("Past month")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole(SINGLE.role, { name: "1Y" }))
    await expect(canvas.getByRole(SINGLE.role, { name: "1Y" })).toHaveAttribute(
      SINGLE.pressed,
      "true"
    )
    await expect(await canvas.findByText("Past year")).toBeInTheDocument()
  })

  await step("reads out the reached point in the header", async () => {
    const open = canvas.getByText("Open").nextElementSibling?.textContent
    await focusPoint(canvasElement, 0)
    await waitFor(() =>
      expect(canvas.queryByText("Past year")).not.toBeInTheDocument()
    )
    await expect(canvas.getByText(`$${open}`)).toBeInTheDocument()
  })
})
test("Default", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartDefault />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      february.month,
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Linear", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartLinear />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      february.month,
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Step", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartStep />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 3)
    await expectTooltip(canvasElement, [
      april.month,
      "Desktop",
      april.desktop.toLocaleString(),
    ])
  })
})
test("Stacked", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartStacked />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 2)
  })

  await step("lists the series in the legend", async () => {
    await expectLegend(canvasElement, ["Desktop", "Mobile"])
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      february.month,
      "Desktop",
      february.desktop.toLocaleString(),
      "Mobile",
      february.mobile.toLocaleString(),
    ])
  })
})
test("Stacked Expand", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartStackedExpand />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 2)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      february.month,
      "Desktop",
      february.desktop.toLocaleString(),
      "Mobile",
      february.mobile.toLocaleString(),
    ])
  })
})
test("Gradient", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartGradient />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 2)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 3)
    await expectTooltip(canvasElement, [
      april.month,
      "Desktop",
      april.desktop.toLocaleString(),
      "Mobile",
      april.mobile.toLocaleString(),
    ])
  })
})
test("Range", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartRange />
    </div>
  )

  await step("draws the range band and the average line", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
    await expectSeries(canvasElement, ".recharts-line-curve", 1)
  })

  await step("shows the reached hour in the tooltip", async () => {
    await focusPoint(canvasElement, 18)
    await expectTooltip(canvasElement, [
      "18:00",
      "Range",
      "104–158 BPM",
      "Average",
      "126 BPM",
    ])
  })
})
test("Axes", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartAxes />
    </div>
  )

  await step("draws the series", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      february.month,
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Sparkline", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <AreaChartSparkline />
    </div>
  )

  await step("draws one sparkline per stock", async () => {
    await expectSeries(canvasElement, ".recharts-area-area", 4)
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4)
  })

  await step("keeps the sparklines out of the tab order", async () => {
    await expect(canvas.queryByRole("application")).not.toBeInTheDocument()
    await expect(canvas.getByText("+1.28%")).toBeInTheDocument()
    await expect(canvas.getByText("-0.64%")).toBeInTheDocument()
  })
})
