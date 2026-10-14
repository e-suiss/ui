import type { Meta, StoryObj } from "@storybook/react-native"
import { RadialChartBatteries } from "@/components/charts/radial-chart-batteries"
import { RadialChartDefault } from "@/components/charts/radial-chart-default"
import { RadialChartGauge } from "@/components/charts/radial-chart-gauge"
import { RadialChartInteractive } from "@/components/charts/radial-chart-interactive"
import { RadialChartLabel } from "@/components/charts/radial-chart-label"
import { RadialChartProgress } from "@/components/charts/radial-chart-progress"
import { RadialChartRings } from "@/components/charts/radial-chart-rings"
import { RadialChartStacked } from "@/components/charts/radial-chart-stacked"
import { RadialChartText } from "@/components/charts/radial-chart-text"
import { RadialChartTinted } from "@/components/charts/radial-chart-tinted"

const meta = {
  title: "Charts/Radial",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Batteries: Story = {
  render: () => <RadialChartBatteries />,
}

export const Default: Story = {
  render: () => <RadialChartDefault />,
}

export const Gauge: Story = {
  render: () => <RadialChartGauge />,
}

export const Interactive: Story = {
  render: () => <RadialChartInteractive />,
}

export const Label: Story = {
  render: () => <RadialChartLabel />,
}

export const Progress: Story = {
  render: () => <RadialChartProgress />,
}

export const Rings: Story = {
  render: () => <RadialChartRings />,
}

export const Stacked: Story = {
  render: () => <RadialChartStacked />,
}

export const Text: Story = {
  render: () => <RadialChartText />,
}

export const Tinted: Story = {
  render: () => <RadialChartTinted />,
}
