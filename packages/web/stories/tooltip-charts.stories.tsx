import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { TooltipChartCustom } from "@/components/charts/tooltip-chart-custom"
import { TooltipChartDashed } from "@/components/charts/tooltip-chart-dashed"
import { TooltipChartDot } from "@/components/charts/tooltip-chart-dot"
import { TooltipChartFormatter } from "@/components/charts/tooltip-chart-formatter"
import { TooltipChartIcons } from "@/components/charts/tooltip-chart-icons"
import { TooltipChartInteractive } from "@/components/charts/tooltip-chart-interactive"
import { TooltipChartLabelFormatter } from "@/components/charts/tooltip-chart-label-formatter"
import { TooltipChartLine } from "@/components/charts/tooltip-chart-line"
import { TooltipChartNoIndicator } from "@/components/charts/tooltip-chart-no-indicator"
import { TooltipChartNoLabel } from "@/components/charts/tooltip-chart-no-label"

const meta = {
  title: "Charts/Tooltip",
  component: TooltipChartDot,
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
} satisfies Meta<typeof TooltipChartDot>

export default meta

type Story = StoryObj<typeof meta>

const DRAWN_PATH = /^M\s?-?\d/
const LONG_DATE = /^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}$/
const BAR = ".recharts-bar-rectangle .recharts-rectangle"

const february = { month: "February", desktop: 305, mobile: 200 }
const march = { month: "March", desktop: 237, mobile: 120 }

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
  const tooltip = root.querySelector<HTMLElement>(".recharts-tooltip-wrapper")
  if (!tooltip) throw new Error("No tooltip wrapper")
  return tooltip
}

async function expectTooltip(root: HTMLElement, texts: string[]) {
  await waitFor(() => {
    for (const text of texts) {
      expect(tooltipOf(root)).toHaveTextContent(text)
    }
  })
}

async function playVisitors(
  root: HTMLElement,
  step: StepFunction,
  options: { label: boolean }
) {
  await step("draws both stacked series", async () => {
    await expectSeries(root, BAR, 12)
  })

  await step("opens on the default month", async () => {
    await expectTooltip(root, [
      "Desktop",
      march.desktop.toLocaleString(),
      "Mobile",
      march.mobile.toLocaleString(),
    ])
    if (options.label) {
      await expect(tooltipOf(root)).toHaveTextContent(march.month)
    } else {
      await expect(tooltipOf(root)).not.toHaveTextContent(march.month)
    }
  })

  await step("follows the keyboard to another month", async () => {
    await focusPoint(root, 1)
    await expectTooltip(root, [
      "Desktop",
      february.desktop.toLocaleString(),
      "Mobile",
      february.mobile.toLocaleString(),
    ])
  })
}

function indicatorsOf(root: HTMLElement, selector: string) {
  return tooltipOf(root).querySelectorAll(selector)
}

type StepFunction = (
  label: string,
  play: () => Promise<void>
) => Promise<void> | void

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <TooltipChartInteractive />,
  play: async ({ canvas, canvasElement, step }) => {
    const quarter = {
      quarter: "Q1 26",
      phones: 71,
      laptops: 9.5,
      services: 29.1,
    }
    const total = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(quarter.phones + quarter.laptops + quarter.services)

    await step("lists the series in the legend", async () => {
      await expectSeries(canvasElement, BAR, 24)
      const legend = canvasElement.querySelector(".recharts-legend-wrapper")
      for (const label of ["Phones", "Laptops", "Services"]) {
        await expect(legend).toHaveTextContent(label)
      }
    })

    await step("opens on the default quarter with its total", async () => {
      await expectTooltip(canvasElement, [
        quarter.quarter,
        `${total}B`,
        "Phones",
        quarter.phones.toLocaleString(),
        "Laptops",
        quarter.laptops.toLocaleString(),
        "Services",
        quarter.services.toLocaleString(),
      ])
    })

    await step("hides the title when the setting is on", async () => {
      const hideTitle = canvas.getByRole("switch", { name: "Hide title" })
      await userEvent.click(hideTitle)
      await expect(hideTitle).toBeChecked()
      await waitFor(() =>
        expect(tooltipOf(canvasElement)).not.toHaveTextContent(quarter.quarter)
      )
      await expect(tooltipOf(canvasElement)).toHaveTextContent("Phones")
    })
  },
}

export const Dot: Story = {
  play: async ({ canvasElement, step }) => {
    await playVisitors(canvasElement, step, { label: true })
  },
}

export const Line: Story = {
  render: () => <TooltipChartLine />,
  play: async ({ canvasElement, step }) => {
    await playVisitors(canvasElement, step, { label: true })
  },
}

export const Dashed: Story = {
  render: () => <TooltipChartDashed />,
  play: async ({ canvasElement, step }) => {
    await playVisitors(canvasElement, step, { label: true })

    await step("marks each series with a dashed indicator", async () => {
      await expect(indicatorsOf(canvasElement, ".border-dashed")).toHaveLength(
        2
      )
    })
  },
}

export const NoIndicator: Story = {
  render: () => <TooltipChartNoIndicator />,
  play: async ({ canvasElement, step }) => {
    await playVisitors(canvasElement, step, { label: true })

    await step("leaves the indicators out", async () => {
      await expect(indicatorsOf(canvasElement, ".shrink-0")).toHaveLength(0)
    })
  },
}

export const NoLabel: Story = {
  render: () => <TooltipChartNoLabel />,
  play: async ({ canvasElement, step }) => {
    await playVisitors(canvasElement, step, { label: false })
  },
}

export const LabelFormatter: Story = {
  render: () => <TooltipChartLabelFormatter />,
  play: async ({ canvasElement, step }) => {
    await step("draws the area", async () => {
      await expectSeries(canvasElement, ".recharts-area-area", 1)
    })

    await step("opens on the default day with a long date", async () => {
      await expectTooltip(canvasElement, [
        "Active energy",
        (690).toLocaleString(),
      ])
      const label = tooltipOf(canvasElement).querySelector(".font-semibold")
      await expect(label?.textContent).toMatch(LONG_DATE)
    })
  },
}

export const Formatter: Story = {
  render: () => <TooltipChartFormatter />,
  play: async ({ canvasElement, step }) => {
    await step("draws a bar per day", async () => {
      await expectSeries(canvasElement, BAR, 7)
    })

    await step("opens on the default day in kcal", async () => {
      await expectTooltip(canvasElement, [
        `Active energy${(575).toLocaleString("en-US")}kcal`,
      ])
    })

    await step("follows the keyboard to another day", async () => {
      await focusPoint(canvasElement, 2)
      await expectTooltip(canvasElement, [
        `Active energy${(447).toLocaleString("en-US")}kcal`,
      ])
    })
  },
}

export const Icons: Story = {
  render: () => <TooltipChartIcons />,
  play: async ({ canvasElement, step }) => {
    await step("draws both stacked series", async () => {
      await expectSeries(canvasElement, BAR, 12)
    })

    await step("opens with an icon beside each series", async () => {
      const april = { month: "April", desktop: 173, mobile: 190 }
      await expectTooltip(canvasElement, [
        april.month,
        "Desktop",
        april.desktop.toLocaleString(),
        "Mobile",
        april.mobile.toLocaleString(),
      ])
      await expect(indicatorsOf(canvasElement, "svg")).toHaveLength(2)
    })
  },
}

export const Custom: Story = {
  render: () => <TooltipChartCustom />,
  play: async ({ canvasElement, step }) => {
    await step("draws a bar per day", async () => {
      await expectSeries(canvasElement, BAR, 7)
    })

    await step("opens the custom card on the default day", async () => {
      await expectTooltip(canvasElement, [
        "Total",
        `${(14320).toLocaleString("en-US")}steps`,
        "Saturday",
      ])
    })

    await step("follows the keyboard to another day", async () => {
      await focusPoint(canvasElement, 3)
      await expectTooltip(canvasElement, [
        `${(12480).toLocaleString("en-US")}steps`,
        "Thursday",
      ])
    })
  },
}
