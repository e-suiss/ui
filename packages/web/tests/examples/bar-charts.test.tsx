import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { BarChartActive } from "@/components/charts/bar-chart-active"
import { BarChartDefault } from "@/components/charts/bar-chart-default"
import { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal"
import { BarChartHourly } from "@/components/charts/bar-chart-hourly"
import { BarChartInteractive } from "@/components/charts/bar-chart-interactive"
import { BarChartLabeled } from "@/components/charts/bar-chart-labeled"
import { BarChartMultiple } from "@/components/charts/bar-chart-multiple"
import { BarChartNegative } from "@/components/charts/bar-chart-negative"
import { BarChartRange } from "@/components/charts/bar-chart-range"
import { BarChartStacked } from "@/components/charts/bar-chart-stacked"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
  aria: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const DRAWN_PATH = /^M\s?-?\d/
const BAR = ".recharts-bar-rectangle .recharts-rectangle"
const february = { month: "February", desktop: 305, mobile: 200 }
const april = { month: "April", desktop: 173, mobile: 190 }
function minutes(value: number) {
  const hours = Math.floor(value / 60)
  return hours ? `${hours}h ${value % 60}m` : `${value}m`
}
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
      <BarChartInteractive />
    </div>
  )

  const wednesday = { social: 70, productivity: 88, entertainment: 95 }

  await step("draws a stacked bar per category and day", async () => {
    await expectSeries(canvasElement, BAR, 21)
  })

  await step("shows the reached day in the tooltip", async () => {
    await focusPoint(canvasElement, 2)
    await expectTooltip(canvasElement, [
      "Wednesday",
      "Social",
      minutes(wednesday.social),
      "Productivity",
      minutes(wednesday.productivity),
      "Entertainment",
      minutes(wednesday.entertainment),
    ])
  })

  await step("selects the day with Enter and opens its hours", async () => {
    await userEvent.keyboard("{Enter}")
    await expect(
      await canvas.findByText(
        minutes(
          wednesday.social + wednesday.productivity + wednesday.entertainment
        )
      )
    ).toBeInTheDocument()
    await userEvent.click(canvas.getByRole(SINGLE.role, { name: "Day" }))
    await expect(
      canvas.getByRole(SINGLE.role, { name: "Day" })
    ).toHaveAttribute(SINGLE.pressed, "true")
    await expect(canvas.getByText("Wednesday")).toBeInTheDocument()
    await expect(await canvas.findByText("18:00")).toBeInTheDocument()
  })
})
test("Default", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartDefault />
    </div>
  )

  await step("draws a bar per month", async () => {
    await expectSeries(canvasElement, BAR, 6)
  })

  await step("shows the reached bar without a label", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
    ])
    await expect(
      canvasElement.querySelector(".recharts-tooltip-wrapper")
    ).not.toHaveTextContent(february.month)
  })
})
test("Multiple", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartMultiple />
    </div>
  )

  await step("draws both series side by side", async () => {
    await expectSeries(canvasElement, BAR, 12)
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
test("Stacked", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartStacked />
    </div>
  )

  await step("draws both stacked series", async () => {
    await expectSeries(canvasElement, BAR, 12)
  })

  await step("lists the series in the legend", async () => {
    await expectLegend(canvasElement, ["Desktop", "Mobile"])
  })

  await step("shows both values of the reached month", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
      "Mobile",
      february.mobile.toLocaleString(),
    ])
  })
})
test("Horizontal", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartHorizontal />
    </div>
  )

  await step("draws a bar per device", async () => {
    await expectSeries(canvasElement, BAR, 5)
  })

  await step("names the reached device in the tooltip", async () => {
    await focusPoint(canvasElement, 0)
    await expectTooltip(canvasElement, ["Phone", (275).toLocaleString()])
  })
})
test("Labeled", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartLabeled />
    </div>
  )

  const values = [186, 305, 237, 173, 209, 264]

  await step("draws a bar per month", async () => {
    await expectSeries(canvasElement, BAR, 6)
  })

  await step("prints each value above its bar", async () => {
    await waitFor(() =>
      expect(
        Array.from(
          canvasElement.querySelectorAll(".recharts-label-list text"),
          (label) => label.textContent
        )
      ).toEqual(values.map(String))
    )
  })

  await step("shows the reached bar in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "Desktop",
      february.desktop.toLocaleString(),
    ])
  })
})
test("Negative", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartNegative />
    </div>
  )

  await step("draws a bar per month", async () => {
    await expectSeries(canvasElement, BAR, 12)
  })

  await step("shows a negative month in the tooltip", async () => {
    await focusPoint(canvasElement, 1)
    await expectTooltip(canvasElement, [
      "February",
      "Cash flow",
      (-18).toLocaleString(),
    ])
  })
})
test("Active", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartActive />
    </div>
  )

  await step("draws a bar per day with Saturday selected", async () => {
    await expectSeries(canvasElement, BAR, 7)
    await expect(
      canvas.getByText((14320).toLocaleString("en-US"))
    ).toBeInTheDocument()
  })

  await step("selects the reached day with Enter", async () => {
    await focusPoint(canvasElement, 2)
    await userEvent.keyboard("{Enter}")
    await expect(
      await canvas.findByText((6120).toLocaleString("en-US"))
    ).toBeInTheDocument()
  })
})
test("Range", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartRange />
    </div>
  )

  await step("draws a bar per day", async () => {
    await expectSeries(canvasElement, BAR, 8)
  })

  await step("shows the reached day's span in the tooltip", async () => {
    await focusPoint(canvasElement, 0)
    await expectTooltip(canvasElement, ["Today", "14° to 22°"])
  })
})
test("Hourly", async () => {
  const { canvasElement, step } = await renderExample(
    <div className="mx-auto w-[min(26rem,calc(100vw-2rem))]">
      <BarChartHourly />
    </div>
  )

  await step("draws a bar per hour with screen time", async () => {
    await expectSeries(canvasElement, BAR, 19)
  })

  await step("shows the reached hour in the tooltip", async () => {
    await focusPoint(canvasElement, 18)
    await expectTooltip(canvasElement, ["18:00", "31 min"])
  })
})
