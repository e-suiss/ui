import type { Meta, StoryObj } from "@storybook/react-vite"

import { TooltipChartCustom } from "@/components/charts/tooltip-chart-custom"
import { TooltipChartDashed } from "@/components/charts/tooltip-chart-dashed"
import { TooltipChartDot } from "@/components/charts/tooltip-chart-dot"
import { TooltipChartFormatter } from "@/components/charts/tooltip-chart-formatter"
import { TooltipChartIcons } from "@/components/charts/tooltip-chart-icons"
import { TooltipChartInteractive } from "@/components/charts/tooltip-chart-interactive"
import { TooltipChartLabelFormatter } from "@/components/charts/tooltip-chart-label-formatter"
import { TooltipChartLine } from "@/components/charts/tooltip-chart-line"
import { TooltipChartNoIndicator } from "@/components/charts/tooltip-chart-no-indicator"
import { TooltipChartNoLabel } from "@/components/charts/tooltip-chart-no-label"

const meta = {
  title: "Charts/Tooltip",
  component: TooltipChartDot,
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
} satisfies Meta<typeof TooltipChartDot>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <TooltipChartInteractive />,
}

export const Dot: Story = {}

export const Line: Story = { render: () => <TooltipChartLine /> }

export const Dashed: Story = { render: () => <TooltipChartDashed /> }

export const NoIndicator: Story = { render: () => <TooltipChartNoIndicator /> }

export const NoLabel: Story = { render: () => <TooltipChartNoLabel /> }

export const LabelFormatter: Story = {
  render: () => <TooltipChartLabelFormatter />,
}

export const Formatter: Story = { render: () => <TooltipChartFormatter /> }

export const Icons: Story = { render: () => <TooltipChartIcons /> }

export const Custom: Story = { render: () => <TooltipChartCustom /> }
