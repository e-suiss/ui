import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

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

const meta = {
  title: "Charts/Line",
  component: LineChartDefault,
  decorators: [
    (Story, { parameters }) => (
      <div
        className={
          parameters.wide
            ? "mx-auto w-[min(60rem,calc(100vw-2rem))]"
            : "mx-auto w-[min(26rem,calc(100vw-2rem))]"
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineChartDefault>

export default meta

type Story = StoryObj<typeof meta>

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

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <LineChartInteractive />,
  play: async ({ canvas, canvasElement, step }) => {
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
      await userEvent.click(canvas.getByRole("button", { name: "High" }))
      await expect(
        await canvas.findByText("High · °C · long-term")
      ).toBeInTheDocument()
    })
  },
}

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("draws the line", async () => {
      await expectSeries(canvasElement, LINE, 1)
    })

    await step("shows the reached point without a label", async () => {
      await focusPoint(canvasElement, 1)
      await expectTooltip(canvasElement, [
        "Desktop",
        february.desktop.toLocaleString(),
      ])
      await expect(tooltipOf(canvasElement)).not.toHaveTextContent(
        february.month
      )
    })
  },
}

export const Linear: Story = {
  render: () => <LineChartLinear />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Step: Story = {
  render: () => <LineChartStep />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Multiple: Story = {
  render: () => <LineChartMultiple />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Dots: Story = {
  render: () => <LineChartDots />,
  play: async ({ canvasElement, step }) => {
    await step("draws the line with a dot per month", async () => {
      await expectSeries(canvasElement, LINE, 1)
      await expectDots(canvasElement, 10)
    })

    await step("shows the reached weight in the tooltip", async () => {
      await focusPoint(canvasElement, 3)
      await expectTooltip(canvasElement, ["Apr", "80.8 kg"])
    })
  },
}

export const Labeled: Story = {
  render: () => <LineChartLabeled />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const GoalDots: Story = {
  render: () => <LineChartGoalDots />,
  play: async ({ canvasElement, step }) => {
    await step("draws the line with a dot per night", async () => {
      await expectSeries(canvasElement, LINE, 1)
      await expectDots(canvasElement, 7)
    })

    await step("shows the reached night in hours and minutes", async () => {
      await focusPoint(canvasElement, 2)
      await expectTooltip(canvasElement, ["Wed", "5h 54m"])
    })
  },
}

export const Forecast: Story = {
  render: () => <LineChartForecast />,
  play: async ({ canvasElement, step }) => {
    await step("draws the actual and forecast lines", async () => {
      await expectSeries(canvasElement, LINE, 2)
    })

    await step("shows both series where they meet", async () => {
      await focusPoint(canvasElement, 8)
      await expectTooltip(canvasElement, ["Sep", "Actual", "Forecast", "26"])
    })
  },
}

export const Goal: Story = {
  render: () => <LineChartGoal />,
  play: async ({ canvasElement, step }) => {
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
  },
}
