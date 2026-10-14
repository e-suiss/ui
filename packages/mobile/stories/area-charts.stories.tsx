import type { Meta, StoryObj } from "@storybook/react-native"
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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AreaChartDefault />,
}

export const Axes: Story = {
  render: () => <AreaChartAxes />,
}

export const Gradient: Story = {
  render: () => <AreaChartGradient />,
}

export const Interactive: Story = {
  render: () => <AreaChartInteractive />,
}

export const Linear: Story = {
  render: () => <AreaChartLinear />,
}

export const Range: Story = {
  render: () => <AreaChartRange />,
}

export const Sparkline: Story = {
  render: () => <AreaChartSparkline />,
}

export const StackedExpand: Story = {
  render: () => <AreaChartStackedExpand />,
}

export const Stacked: Story = {
  render: () => <AreaChartStacked />,
}

export const Step: Story = {
  render: () => <AreaChartStep />,
}
