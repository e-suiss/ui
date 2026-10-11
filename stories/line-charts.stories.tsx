import type { Meta, StoryObj } from "@storybook/react-native"
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
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <LineChartDefault />,
}

export const Dots: Story = {
  render: () => <LineChartDots />,
}

export const Forecast: Story = {
  render: () => <LineChartForecast />,
}

export const GoalDots: Story = {
  render: () => <LineChartGoalDots />,
}

export const Goal: Story = {
  render: () => <LineChartGoal />,
}

export const Interactive: Story = {
  render: () => <LineChartInteractive />,
}

export const Labeled: Story = {
  render: () => <LineChartLabeled />,
}

export const Linear: Story = {
  render: () => <LineChartLinear />,
}

export const Multiple: Story = {
  render: () => <LineChartMultiple />,
}

export const Step: Story = {
  render: () => <LineChartStep />,
}
