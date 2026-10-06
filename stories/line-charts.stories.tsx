import type { Meta, StoryObj } from "@storybook/react-vite"

import { LineChartDefault } from "@/components/charts/line-chart-default"
import { LineChartDots } from "@/components/charts/line-chart-dots"
import { LineChartForecast } from "@/components/charts/line-chart-forecast"
import { LineChartGoal } from "@/components/charts/line-chart-goal"
import { LineChartGoalDots } from "@/components/charts/line-chart-goal-dots"
import { LineChartInteractive } from "@/components/charts/line-chart-interactive"
import { LineChartLabeled } from "@/components/charts/line-chart-labeled"
import { LineChartLinear } from "@/components/charts/line-chart-linear"
import { LineChartMultiple } from "@/components/charts/line-chart-multiple"
import { LineChartStep } from "@/components/charts/line-chart-step"

const meta = {
  title: "Charts/Line",
  component: LineChartDefault,
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
} satisfies Meta<typeof LineChartDefault>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <LineChartInteractive />,
}

export const Default: Story = {}

export const Linear: Story = { render: () => <LineChartLinear /> }

export const Step: Story = { render: () => <LineChartStep /> }

export const Multiple: Story = { render: () => <LineChartMultiple /> }

export const Dots: Story = { render: () => <LineChartDots /> }

export const Labeled: Story = { render: () => <LineChartLabeled /> }

export const GoalDots: Story = { render: () => <LineChartGoalDots /> }

export const Forecast: Story = { render: () => <LineChartForecast /> }

export const Goal: Story = { render: () => <LineChartGoal /> }
