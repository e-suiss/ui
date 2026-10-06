import type { Meta, StoryObj } from "@storybook/react-vite"

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
  component: RadialChartDefault,
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
} satisfies Meta<typeof RadialChartDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <RadialChartInteractive />,
}

export const Default: Story = {}

export const Label: Story = { render: () => <RadialChartLabel /> }

export const Tinted: Story = { render: () => <RadialChartTinted /> }

export const Text: Story = { render: () => <RadialChartText /> }

export const Stacked: Story = { render: () => <RadialChartStacked /> }

export const Rings: Story = { render: () => <RadialChartRings /> }

export const Gauge: Story = { render: () => <RadialChartGauge /> }

export const Batteries: Story = { render: () => <RadialChartBatteries /> }

export const Progress: Story = { render: () => <RadialChartProgress /> }
