import type { Meta, StoryObj } from "@storybook/react-vite"

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

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <AreaChartInteractive />,
}

export const Default: Story = {}

export const Linear: Story = { render: () => <AreaChartLinear /> }

export const Step: Story = { render: () => <AreaChartStep /> }

export const Stacked: Story = { render: () => <AreaChartStacked /> }

export const StackedExpand: Story = {
  render: () => <AreaChartStackedExpand />,
}

export const Gradient: Story = { render: () => <AreaChartGradient /> }

export const Range: Story = { render: () => <AreaChartRange /> }

export const Axes: Story = { render: () => <AreaChartAxes /> }

export const Sparkline: Story = { render: () => <AreaChartSparkline /> }
