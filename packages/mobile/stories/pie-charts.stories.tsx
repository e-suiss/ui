import type { Meta, StoryObj } from "@storybook/react-native"
import { PieChartActive } from "@/components/charts/pie-chart-active"
import { PieChartDefault } from "@/components/charts/pie-chart-default"
import { PieChartDonut } from "@/components/charts/pie-chart-donut"
import { PieChartDonutText } from "@/components/charts/pie-chart-donut-text"
import { PieChartHalf } from "@/components/charts/pie-chart-half"
import { PieChartInteractive } from "@/components/charts/pie-chart-interactive"
import { PieChartLabel } from "@/components/charts/pie-chart-label"
import { PieChartLegend } from "@/components/charts/pie-chart-legend"
import { PieChartNested } from "@/components/charts/pie-chart-nested"
import { PieChartSeparated } from "@/components/charts/pie-chart-separated"

const meta = {
  title: "Charts/Pie",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {
  render: () => <PieChartActive />,
}

export const Default: Story = {
  render: () => <PieChartDefault />,
}

export const DonutText: Story = {
  render: () => <PieChartDonutText />,
}

export const Donut: Story = {
  render: () => <PieChartDonut />,
}

export const Half: Story = {
  render: () => <PieChartHalf />,
}

export const Interactive: Story = {
  render: () => <PieChartInteractive />,
}

export const Label: Story = {
  render: () => <PieChartLabel />,
}

export const Legend: Story = {
  render: () => <PieChartLegend />,
}

export const Nested: Story = {
  render: () => <PieChartNested />,
}

export const Separated: Story = {
  render: () => <PieChartSeparated />,
}
