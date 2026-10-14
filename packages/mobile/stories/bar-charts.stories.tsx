import type { Meta, StoryObj } from "@storybook/react-native"
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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {
  render: () => <BarChartActive />,
}

export const Default: Story = {
  render: () => <BarChartDefault />,
}

export const Horizontal: Story = {
  render: () => <BarChartHorizontal />,
}

export const Hourly: Story = {
  render: () => <BarChartHourly />,
}

export const Interactive: Story = {
  render: () => <BarChartInteractive />,
}

export const Labeled: Story = {
  render: () => <BarChartLabeled />,
}

export const Multiple: Story = {
  render: () => <BarChartMultiple />,
}

export const Negative: Story = {
  render: () => <BarChartNegative />,
}

export const Range: Story = {
  render: () => <BarChartRange />,
}

export const Stacked: Story = {
  render: () => <BarChartStacked />,
}
