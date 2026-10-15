import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { LineChartDefault } from "@/components/charts/line-chart-default"
import { LineChartDots } from "@/components/charts/line-chart-dots"
import { LineChartForecast } from "@/components/charts/line-chart-forecast"
import { LineChartGoal } from "@/components/charts/line-chart-goal"
import { LineChartGoalDots } from "@/components/charts/line-chart-goal-dots"
import { LineChartInteractive } from "@/components/charts/line-chart-interactive"
import { LineChartLabeled } from "@/components/charts/line-chart-labeled"
import { LineChartLinear } from "@/components/charts/line-chart-linear"
import { LineChartMultiple } from "@/components/charts/line-chart-multiple"
import { LineChartStep } from "@/components/charts/line-chart-step"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
  aria: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const DRAWN_PATH = /^M\s?-?\d/
const LINE = ".recharts-line-curve"
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
function tooltipOf(root: HTMLElement) {
  return root.querySelector(".recharts-tooltip-wrapper")
}
async function expectTooltip(root: HTMLElement, texts: string[]) {
  await waitFor(() => {
    for (const text of texts) {
      expect(tooltipOf(root)).toHaveTextContent(text)
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
async function expectDots(root: HTMLElement, count: number) {
  await waitFor(() =>
    expect(root.querySelectorAll(".recharts-line-dots circle")).toHaveLength(
      count
    )
  )
}

test("Interactive", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(60rem,calc(100vw-2rem))]">
      <LineChartInteractive />
    </div>
  )

  await step("adds a city line when its chip is pressed", async () => {
    await expectSeries(canvasElement, LINE, 3)
    const izmir = canvas.getByRole("button", { name: "Izmir" })
    await expect(izmir).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(izmir)
    await expect(izmir).toHaveAttribute("aria-pressed", "true")
    await expectSeries(canvasElement, LINE, 4)
  })

  await step("shows every shown city for the reached month", async () => {
    await focusPoint(canvasElement, 6)
    await expectTooltip(canvasElement, [
      "July",
      "Istanbul",
      "24°",
      "Ankara",
      "Izmir",
      "28°",
      "Antalya",
      "29°",
    ])
    await expect(tooltipOf(canvasElement)).not.toHaveTextContent("Erzurum")
  })

  await step("switches the temperature mode", async () => {
    await userEvent.click(canvas.getByRole(SINGLE.role, { name: "High" }))
    await expect(
      await canvas.findByText("High · °C · long-term")
    ).toBeInTheDocument()
  })
})
test("Default", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartDefault />
    </div>
  )

  await step("draws the line", async () => {
    await expectSeries(canvasElement, LINE, 1)
  })

  await step("shows the reached point without a label", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
    ])
    await expect(tooltipOf(canvasElement)).not.toHaveTextContent(february.month)
  })
})
test("Linear", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartLinear />
    </div>
  )

  await step("draws the line", async () => {
    await expectSeries(canvasElement, LINE, 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 3)
    await expectTooltip(canvasElement, [
      "Desktop",
      april.desktop.toLocaleString(),
    ])
  })
})
test("Step", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartStep />
    </div>
  )

  await step("draws the line", async () => {
    await expectSeries(canvasElement, LINE, 1)
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Multiple", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartMultiple />
    </div>
  )

  await step("draws both lines", async () => {
    await expectSeries(canvasElement, LINE, 2)
  })

  await step("lists the series in the legend", async () => {
    await expectLegend(canvasElement, ["Desktop", "Mobile"])
  })

  await step("shows both values of the reached month", async () => {
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
test("Dots", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartDots />
    </div>
  )

  await step("draws the line with a dot per month", async () => {
    await expectSeries(canvasElement, LINE, 1)
    await expectDots(canvasElement, 10)
  })

  await step("shows the reached weight in the tooltip", async () => {
    await focusPoint(canvasElement, 3)
    await expectTooltip(canvasElement, ["Apr", "80.8 kg"])
  })
})
test("Labeled", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartLabeled />
    </div>
  )

  const values = [186, 305, 237, 173, 209, 264]

  await step("draws the line", async () => {
    await expectSeries(canvasElement, LINE, 1)
  })

  await step("prints each value above its point", async () => {
    await waitFor(
      () =>
        expect(
          Array.from(
            canvasElement.querySelectorAll(".recharts-label-list text"),
            (label) => label.textContent
          )
        ).toEqual(values.map(String)),
      { timeout: 3000 }
    )
  })

  await step("shows the reached point in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Goal Dots", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartGoalDots />
    </div>
  )

  await step("draws the line with a dot per night", async () => {
    await expectSeries(canvasElement, LINE, 1)
    await expectDots(canvasElement, 7)
  })

  await step("shows the reached night in hours and minutes", async () => {
    await focusPoint(canvasElement, 2)
    await expectTooltip(canvasElement, ["Wed", "5h 54m"])
  })
})
test("Forecast", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartForecast />
    </div>
  )

  await step("draws the actual and forecast lines", async () => {
    await expectSeries(canvasElement, LINE, 2)
  })

  await step("shows both series where they meet", async () => {
    await focusPoint(canvasElement, 8)
    await expectTooltip(canvasElement, ["Sep", "Actual", "Forecast", "26"])
  })
})
test("Goal", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <LineChartGoal />
    </div>
  )

  await step("draws the line", async () => {
    await expectSeries(canvasElement, LINE, 1)
  })

  await step("shows the reached day in steps", async () => {
    await focusPoint(canvasElement, 3)
    await expectTooltip(canvasElement, [
      "Thu",
      `${(12480).toLocaleString("en-US")} steps`,
    ])
  })
})
