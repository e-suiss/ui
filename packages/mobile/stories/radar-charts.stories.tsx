import type { Meta, StoryObj } from "@storybook/react-native"
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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <RadarChartDefault />,
}

export const Dots: Story = {
  render: () => <RadarChartDots />,
}

export const GridCircle: Story = {
  render: () => <RadarChartGridCircle />,
}

export const GridFilled: Story = {
  render: () => <RadarChartGridFilled />,
}

export const GridNone: Story = {
  render: () => <RadarChartGridNone />,
}

export const Interactive: Story = {
  render: () => <RadarChartInteractive />,
}

export const Legend: Story = {
  render: () => <RadarChartLegend />,
}

export const LinesOnly: Story = {
  render: () => <RadarChartLinesOnly />,
}

export const Multiple: Story = {
  render: () => <RadarChartMultiple />,
}

export const RadiusAxis: Story = {
  render: () => <RadarChartRadiusAxis />,
}
