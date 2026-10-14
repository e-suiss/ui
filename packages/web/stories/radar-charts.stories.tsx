import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { RadarChartDefault } from "@/components/charts/radar-chart-default"
import { RadarChartDots } from "@/components/charts/radar-chart-dots"
import { RadarChartGridCircle } from "@/components/charts/radar-chart-grid-circle"
import { RadarChartGridFilled } from "@/components/charts/radar-chart-grid-filled"
import { RadarChartGridNone } from "@/components/charts/radar-chart-grid-none"
import { RadarChartInteractive } from "@/components/charts/radar-chart-interactive"
import { RadarChartLegend } from "@/components/charts/radar-chart-legend"
import { RadarChartLinesOnly } from "@/components/charts/radar-chart-lines-only"
import { RadarChartMultiple } from "@/components/charts/radar-chart-multiple"
import { RadarChartRadiusAxis } from "@/components/charts/radar-chart-radius-axis"

const meta = {
  title: "Charts/Radar",
  component: RadarChartDefault,
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
} satisfies Meta<typeof RadarChartDefault>

export default meta

type Story = StoryObj<typeof meta>

const DRAWN_PATH = /^M\s?-?\d/
const POLYGON = ".recharts-radar-polygon .recharts-polygon"

const strength = { skill: "Strength", thisMonth: 62, lastMonth: 58 }
const balance = { skill: "Balance", thisMonth: 70, lastMonth: 60 }

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

async function playThisMonth(root: HTMLElement, step: StepFunction) {
  await step("draws this month's shape", async () => {
    await expectSeries(root, POLYGON, 1)
  })

  await step("shows the reached skill in the tooltip", async () => {
    await focusPoint(root, 1)
    await expectTooltip(root, [
      strength.skill,
      "This month",
      strength.thisMonth.toLocaleString(),
    ])
  })
}

async function playBothMonths(root: HTMLElement, step: StepFunction) {
  await step("draws both months", async () => {
    await expectSeries(root, POLYGON, 2)
  })

  await step("shows both months for the reached skill", async () => {
    await focusPoint(root, 3)
    await expectTooltip(root, [
      balance.skill,
      "Last month",
      balance.lastMonth.toLocaleString(),
      "This month",
      balance.thisMonth.toLocaleString(),
    ])
  })
}

type StepFunction = (
  label: string,
  play: () => Promise<void>
) => Promise<void> | void

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <RadarChartInteractive />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("adds a model when its chip is pressed", async () => {
      await expectSeries(canvasElement, POLYGON, 2)
      const phone = canvas.getByRole("button", { name: "Phone" })
      await expect(phone).toHaveAttribute("aria-pressed", "false")
      await userEvent.click(phone)
      await expect(phone).toHaveAttribute("aria-pressed", "true")
      await expectSeries(canvasElement, POLYGON, 3)
    })

    await step("shows each shown model for the reached axis", async () => {
      await focusPoint(canvasElement, 1)
      await expectTooltip(canvasElement, [
        "Battery",
        "Phone Pro",
        "90",
        "Phone Air",
        "68",
        "Phone",
        "82",
      ])
    })

    await step("lists the reached axis scores beside the chart", async () => {
      const list = within(canvas.getByRole("list"))
      await waitFor(() =>
        expect(list.queryByText("Overall score")).not.toBeInTheDocument()
      )
      await expect(list.getAllByText("Battery")).toHaveLength(4)
    })
  },
}

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)
  },
}

export const Dots: Story = {
  render: () => <RadarChartDots />,
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)

    await step("puts a dot on every skill", async () => {
      await waitFor(() =>
        expect(
          canvasElement.querySelectorAll(".recharts-radar-dot")
        ).toHaveLength(6)
      )
    })
  },
}

export const Multiple: Story = {
  render: () => <RadarChartMultiple />,
  play: async ({ canvasElement, step }) => {
    await playBothMonths(canvasElement, step)
  },
}

export const LinesOnly: Story = {
  render: () => <RadarChartLinesOnly />,
  play: async ({ canvasElement, step }) => {
    await playBothMonths(canvasElement, step)
  },
}

export const GridCircle: Story = {
  render: () => <RadarChartGridCircle />,
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)
  },
}

export const GridFilled: Story = {
  render: () => <RadarChartGridFilled />,
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)
  },
}

export const Legend: Story = {
  render: () => <RadarChartLegend />,
  play: async ({ canvasElement, step }) => {
    await playBothMonths(canvasElement, step)

    await step("lists both months in the legend", async () => {
      await waitFor(() => {
        const legend = canvasElement.querySelector(".recharts-legend-wrapper")
        expect(legend).toHaveTextContent("This month")
        expect(legend).toHaveTextContent("Last month")
      })
    })
  },
}

export const RadiusAxis: Story = {
  render: () => <RadarChartRadiusAxis />,
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)

    await step("labels the radius axis from 0 to 100", async () => {
      await waitFor(() =>
        expect(
          Array.from(
            canvasElement.querySelectorAll(".recharts-polar-radius-axis-tick"),
            (tick) => tick.textContent
          )
        ).toEqual(["0", "25", "50", "75", "100"])
      )
    })
  },
}

export const GridNone: Story = {
  render: () => <RadarChartGridNone />,
  play: async ({ canvasElement, step }) => {
    await playThisMonth(canvasElement, step)
  },
}
