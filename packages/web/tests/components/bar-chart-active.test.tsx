import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BarChartActive } from "@/components/charts/bar-chart-active"

const SELECT_A_BAR = /select a bar/

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const total = () =>
  page.getByText("steps", { exact: true }).element().parentElement
const caption = () => page.getByText(SELECT_A_BAR)

function bars() {
  return Array.from(
    document.querySelectorAll<SVGPathElement>(".recharts-bar-rectangle path")
  )
}

const opacities = () =>
  bars().map((bar) => Number(bar.getAttribute("fill-opacity")))

const selectedOnly = (index: number) =>
  DAYS.map((_, position) => (position === index ? 1 : 0.3))

function chart() {
  const node = page.getByRole("application").element()
  if (!(node instanceof SVGElement)) throw new Error("chart not found")
  return node
}

async function renderChart() {
  const screen = await render(
    <div className="flex w-[26rem] flex-col gap-4">
      <button type="button">Outside</button>
      <BarChartActive />
    </div>
  )
  await page.getByRole("button", { name: "Outside" }).hover()
  await expect.poll(() => bars().length).toBe(7)
  return screen
}

async function pointAt(steps: number) {
  chart().focus()
  for (let step = 0; step < steps; step++) {
    await userEvent.keyboard("{ArrowRight}")
    await frames()
  }
}

async function frames() {
  for (let index = 0; index < 3; index++) {
    await new Promise(requestAnimationFrame)
  }
}

describe("BarChartActive", () => {
  it("starts on Saturday with that bar highlighted", async () => {
    await renderChart()
    await expect.element(caption()).toHaveTextContent("Saturday · select a bar")
    expect(total()?.textContent).toBe("14,320steps")
    expect(total()?.getAttribute("aria-live")).toBe("polite")
    expect(opacities()).toEqual(selectedOnly(5))
    expect(
      Array.from(
        document.querySelectorAll(
          ".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value"
        ),
        (tick) => tick.textContent
      )
    ).toEqual(DAYS)
  })

  it("draws bar heights in proportion to the steps", async () => {
    await renderChart()
    const heights = bars().map((bar) => bar.getBoundingClientRect().height)
    const tallest = Math.max(...heights)
    expect(heights.indexOf(tallest)).toBe(5)
    expect(heights[6]).toBeLessThan(heights[0] ?? 0)
    expect((heights[6] ?? 0) / tallest).toBeCloseTo(4870 / 14320, 1)
  })

  it("selects a day when its bar is clicked", async () => {
    await renderChart()
    const tuesday = bars()[1]
    if (!tuesday) throw new Error("Tuesday bar not found")
    await userEvent.click(tuesday)
    await expect.element(caption()).toHaveTextContent("Tuesday · select a bar")
    expect(total()?.textContent).toBe("10,230steps")
    expect(opacities()).toEqual(selectedOnly(1))
    const sunday = bars()[6]
    if (!sunday) throw new Error("Sunday bar not found")
    await userEvent.click(sunday)
    await expect.element(caption()).toHaveTextContent("Sunday · select a bar")
    expect(total()?.textContent).toBe("4,870steps")
  })

  it("selects the bar under the keyboard cursor with Enter", async () => {
    await renderChart()
    await pointAt(2)
    expect(caption().element().textContent).toBe("Saturday · select a bar")
    await userEvent.keyboard("{Enter}")
    await expect
      .element(caption())
      .toHaveTextContent("Wednesday · select a bar")
    expect(total()?.textContent).toBe("6,120steps")
    expect(opacities()).toEqual(selectedOnly(2))
  })

  it("selects with Space as well", async () => {
    await renderChart()
    await pointAt(3)
    await userEvent.keyboard(" ")
    await expect.element(caption()).toHaveTextContent("Thursday · select a bar")
    expect(total()?.textContent).toBe("12,480steps")
  })

  it("moves back with the left arrow before selecting", async () => {
    await renderChart()
    await pointAt(4)
    await userEvent.keyboard("{ArrowLeft}")
    await frames()
    await userEvent.keyboard("{ArrowLeft}")
    await frames()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(caption())
      .toHaveTextContent("Wednesday · select a bar")
  })

  it("ignores other keys", async () => {
    await renderChart()
    await pointAt(1)
    await userEvent.keyboard("a{Tab}")
    await expect.element(caption()).toHaveTextContent("Saturday · select a bar")
    expect(opacities()).toEqual(selectedOnly(5))
  })

  it("does not change the selection when a bar is only hovered", async () => {
    await renderChart()
    const monday = bars()[0]
    if (!monday) throw new Error("Monday bar not found")
    await userEvent.hover(monday)
    await expect.element(caption()).toHaveTextContent("Saturday · select a bar")
    expect(opacities()).toEqual(selectedOnly(5))
  })
})
