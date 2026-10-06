import type { Meta, StoryObj } from "@storybook/react-vite"

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

const meta = {
  title: "Charts/Bar",
  component: BarChartDefault,
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
} satisfies Meta<typeof BarChartDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <BarChartInteractive />,
}

export const Default: Story = {}

export const Multiple: Story = { render: () => <BarChartMultiple /> }

export const Stacked: Story = { render: () => <BarChartStacked /> }

export const Horizontal: Story = { render: () => <BarChartHorizontal /> }

export const Labeled: Story = { render: () => <BarChartLabeled /> }

export const Negative: Story = { render: () => <BarChartNegative /> }

export const Active: Story = { render: () => <BarChartActive /> }

export const Range: Story = { render: () => <BarChartRange /> }

export const Hourly: Story = { render: () => <BarChartHourly /> }
