// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const visitors = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const visitorsConfig = {
  desktop: { label: "Desktop", color: "var(--blue)" },
  mobile: { label: "Mobile", color: "var(--green)" },
} satisfies ChartConfig

const browsers = [
  { browser: "safari", visitors: 275, fill: "var(--color-safari)" },
  { browser: "chrome", visitors: 200, fill: "var(--color-chrome)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const browsersConfig = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--blue)" },
  chrome: { label: "Chrome", color: "var(--green)" },
  firefox: { label: "Firefox", color: "var(--orange)" },
  edge: { label: "Edge", color: "var(--purple)" },
  other: { label: "Other", color: "var(--red)" },
} satisfies ChartConfig

const shortMonth = (value: string) => value.slice(0, 3)

const meta = {
  title: "Components/Chart",
  component: ChartContainer,
  args: {
    config: visitorsConfig,
    className: "w-full",
    children: (
      <BarChart accessibilityLayer data={visitors}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
      </BarChart>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[min(32rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws a bar for every month", async () => {
      await expect(await canvas.findByText("Jan")).toBeVisible()
      await expect(canvas.getByText("Jun")).toBeVisible()
      await waitFor(() =>
        expect(
          canvasElement.querySelectorAll(".recharts-bar-rectangle")
        ).toHaveLength(visitors.length)
      )
    })

    await step("shows the tooltip from the keyboard", async () => {
      await userEvent.tab()
      await userEvent.keyboard("{ArrowRight}")
      await waitFor(() =>
        expect(screen.getByText("February")).toBeInTheDocument()
      )
      await expect(screen.getByText("Desktop")).toBeInTheDocument()
      await expect(screen.getByText("305")).toBeInTheDocument()
    })
  },
}

export const MultipleSeries: Story = {
  args: {
    children: (
      <BarChart accessibilityLayer data={visitors}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={6} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={6} />
      </BarChart>
    ),
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("Desktop")).toBeVisible()
    await expect(canvas.getByText("Mobile")).toBeVisible()
  },
}

export const Stacked: Story = {
  args: {
    children: (
      <BarChart accessibilityLayer data={visitors}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          stackId="a"
          fill="var(--color-desktop)"
          radius={[0, 0, 6, 6]}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill="var(--color-mobile)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    ),
  },
}

export const LineSeries: Story = {
  args: {
    children: (
      <LineChart
        accessibilityLayer
        data={visitors}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    ),
  },
}

export const AreaSeries: Story = {
  args: {
    children: (
      <AreaChart
        accessibilityLayer
        data={visitors}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="mobile"
          type="natural"
          stackId="a"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
        />
        <Area
          dataKey="desktop"
          type="natural"
          stackId="a"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    ),
  },
}

export const Donut: Story = {
  args: {
    config: browsersConfig,
    className: "mx-auto aspect-square w-full max-w-72",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={browsers}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          strokeWidth={4}
        />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
      </PieChart>
    ),
  },
  play: async ({ canvas }) => {
    for (const label of ["Safari", "Chrome", "Firefox", "Edge", "Other"]) {
      await expect(await canvas.findByText(label)).toBeVisible()
    }
  },
}
