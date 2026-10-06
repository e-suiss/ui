import type { Meta, StoryObj } from "@storybook/react-vite"

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
  component: RadarChartDefault,
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
} satisfies Meta<typeof RadarChartDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <RadarChartInteractive />,
}

export const Default: Story = {}

export const Dots: Story = { render: () => <RadarChartDots /> }

export const Multiple: Story = { render: () => <RadarChartMultiple /> }

export const LinesOnly: Story = { render: () => <RadarChartLinesOnly /> }

export const GridCircle: Story = { render: () => <RadarChartGridCircle /> }

export const GridFilled: Story = { render: () => <RadarChartGridFilled /> }

export const Legend: Story = { render: () => <RadarChartLegend /> }

export const RadiusAxis: Story = { render: () => <RadarChartRadiusAxis /> }

export const GridNone: Story = { render: () => <RadarChartGridNone /> }
