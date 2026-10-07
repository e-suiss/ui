import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

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

const meta = {
  title: "Charts/Area",
  component: AreaChartDefault,
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
} satisfies Meta<typeof AreaChartDefault>

export default meta

type Story = StoryObj<typeof meta>

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

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <AreaChartInteractive />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws the price series", async () => {
      await expectSeries(canvasElement, ".recharts-area-area", 1)
    })

    await step("switches the time range", async () => {
      await expect(canvas.getByText("Past month")).toBeInTheDocument()
      await userEvent.click(canvas.getByRole("button", { name: "1Y" }))
      await expect(canvas.getByRole("button", { name: "1Y" })).toHaveAttribute(
        "aria-pressed",
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
  },
}

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Linear: Story = {
  render: () => <AreaChartLinear />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Step: Story = {
  render: () => <AreaChartStep />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Stacked: Story = {
  render: () => <AreaChartStacked />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const StackedExpand: Story = {
  render: () => <AreaChartStackedExpand />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Gradient: Story = {
  render: () => <AreaChartGradient />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Range: Story = {
  render: () => <AreaChartRange />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Axes: Story = {
  render: () => <AreaChartAxes />,
  play: async ({ canvasElement, step }) => {
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
  },
}

export const Sparkline: Story = {
  render: () => <AreaChartSparkline />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws one sparkline per stock", async () => {
      await expectSeries(canvasElement, ".recharts-area-area", 4)
      await expect(canvas.getAllByRole("listitem")).toHaveLength(4)
    })

    await step("keeps the sparklines out of the tab order", async () => {
      await expect(canvas.queryByRole("application")).not.toBeInTheDocument()
      await expect(canvas.getByText("+1.28%")).toBeInTheDocument()
      await expect(canvas.getByText("-0.64%")).toBeInTheDocument()
    })
  },
}
