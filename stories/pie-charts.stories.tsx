import type { Meta, StoryObj } from "@storybook/react-vite"

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
  component: PieChartDefault,
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
} satisfies Meta<typeof PieChartDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <PieChartInteractive />,
}

export const Default: Story = {}

export const Donut: Story = { render: () => <PieChartDonut /> }

export const DonutText: Story = { render: () => <PieChartDonutText /> }

export const Label: Story = { render: () => <PieChartLabel /> }

export const Active: Story = { render: () => <PieChartActive /> }

export const Half: Story = { render: () => <PieChartHalf /> }

export const Nested: Story = { render: () => <PieChartNested /> }

export const Legend: Story = { render: () => <PieChartLegend /> }

export const Separated: Story = { render: () => <PieChartSeparated /> }
