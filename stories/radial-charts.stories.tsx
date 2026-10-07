import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

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

const DRAWN_PATH = /^M\s?-?\d/
const BAR = ".recharts-radial-bar-sectors .recharts-sector"

const devices = [
  { label: "Phone", users: 275 },
  { label: "Laptop", users: 200 },
  { label: "Tablet", users: 187 },
  { label: "Watch", users: 173 },
]

async function expectSeries(
  root: HTMLElement,
  selector: string,
  count: number
) {
  await waitFor(() => {
    const shapes = Array.from(root.querySelectorAll(selector))
    expect(shapes).toHaveLength(count)
    for (const shape of shapes) {
      expect(shape.getAttribute("d")).toMatch(DRAWN_PATH)
    }
  })
}

async function focusPoint(root: HTMLElement, index: number) {
  const surface = await within(root).findByRole("application")
  surface.focus()
  for (let step = 0; step < index; step++) {
    await userEvent.keyboard("{ArrowRight}")
  }
}

async function expectTooltip(root: HTMLElement, texts: string[]) {
  await waitFor(() => {
    const tooltip = root.querySelector(".recharts-tooltip-wrapper")
    for (const text of texts) {
      expect(tooltip).toHaveTextContent(text)
    }
  })
}

async function playDevices(root: HTMLElement, step: StepFunction) {
  await step("draws a bar per device", async () => {
    await expectSeries(root, BAR, devices.length)
  })

  await step("names the reached device in the tooltip", async () => {
    const laptop = devices[1]
    if (!laptop) throw new Error("No laptop in the data")
    await focusPoint(root, 1)
    await expectTooltip(root, [laptop.label, laptop.users.toLocaleString()])
  })
}

type StepFunction = (
  label: string,
  play: () => Promise<void>
) => Promise<void> | void

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <RadialChartInteractive />,
  play: async ({ canvas, step }) => {
    await step("starts on Sunday with its rings filled", async () => {
      await expect(
        canvas.getByRole("button", { name: "Sunday" })
      ).toHaveAttribute("aria-pressed", "true")
      await waitFor(() => {
        expect(canvas.getByText("486/600")).toBeInTheDocument()
        expect(canvas.getByText("24/30")).toBeInTheDocument()
        expect(canvas.getByText("10/12")).toBeInTheDocument()
      })
    })

    await step("switches to the picked day", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Wednesday" }))
      await expect(
        canvas.getByRole("button", { name: "Wednesday" })
      ).toHaveAttribute("aria-pressed", "true")
      await waitFor(
        () => {
          expect(canvas.getByText("380/600")).toBeInTheDocument()
          expect(canvas.getByText("18/30")).toBeInTheDocument()
          expect(canvas.getByText("9/12")).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
      await expect(canvas.getByText("63%")).toBeInTheDocument()
      await expect(canvas.getByText("60%")).toBeInTheDocument()
      await expect(canvas.getByText("75%")).toBeInTheDocument()
    })
  },
}

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)
  },
}

export const Label: Story = {
  render: () => <RadialChartLabel />,
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)

    await step("names each bar at its start", async () => {
      await waitFor(
        () =>
          expect(
            Array.from(
              canvasElement.querySelectorAll(".recharts-radial-bar-label"),
              (label) => label.textContent
            )
          ).toEqual(devices.map((device) => device.label)),
        { timeout: 3000 }
      )
    })
  },
}

export const Tinted: Story = {
  render: () => <RadialChartTinted />,
  play: async ({ canvasElement, step }) => {
    await step("draws a tinted track under each bar", async () => {
      await expectSeries(canvasElement, BAR, devices.length * 2)
    })

    await step("names the reached device in the tooltip", async () => {
      await focusPoint(canvasElement, 2)
      await expectTooltip(canvasElement, ["Tablet", (187).toLocaleString()])
    })
  },
}

export const Text: Story = {
  render: () => <RadialChartText />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws the used share with its total", async () => {
      await expectSeries(canvasElement, BAR, 1)
      await expect(canvas.getByText("72%")).toBeInTheDocument()
      await expect(canvas.getByText("cloud storage used")).toBeInTheDocument()
    })
  },
}

export const Stacked: Story = {
  render: () => <RadialChartStacked />,
  play: async ({ canvas, canvasElement, step }) => {
    const visitors = { desktop: 1260, mobile: 570 }

    await step("draws both series with the total below", async () => {
      await expectSeries(canvasElement, BAR, 2)
      await expect(
        canvas.getByText(
          (visitors.desktop + visitors.mobile).toLocaleString("en-US")
        )
      ).toBeInTheDocument()
    })

    await step("shows both series in the tooltip", async () => {
      await focusPoint(canvasElement, 0)
      await expectTooltip(canvasElement, [
        "Desktop",
        visitors.desktop.toLocaleString(),
        "Mobile",
        visitors.mobile.toLocaleString(),
      ])
    })
  },
}

export const Rings: Story = {
  render: () => <RadialChartRings />,
  play: async ({ canvas, step }) => {
    await step("names every ring with its value and goal", async () => {
      const rings = canvas.getByRole("img", {
        name: "Move 720 of 600, Exercise 62 of 30, Stand 12 of 12",
      })
      await expect(rings.querySelectorAll("circle")).toHaveLength(6)
    })
  },
}

export const Gauge: Story = {
  render: () => <RadialChartGauge />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws the reading with its value", async () => {
      await expectSeries(canvasElement, BAR, 1)
      await expect(canvas.getByText("38")).toBeInTheDocument()
      await expect(canvas.getByText("Good")).toBeInTheDocument()
    })
  },
}

export const Batteries: Story = {
  render: () => <RadialChartBatteries />,
  play: async ({ canvas, canvasElement, step }) => {
    const levels = [
      { name: "Phone", level: 82 },
      { name: "Earbuds", level: 46 },
      { name: "Watch", level: 18 },
      { name: "Case", level: 100 },
    ]

    await step("draws a ring per device", async () => {
      await expectSeries(canvasElement, BAR, levels.length)
      await expect(canvas.queryByRole("application")).not.toBeInTheDocument()
    })

    await step("prints each device with its level", async () => {
      const items = canvas.getAllByRole("listitem")
      await expect(items).toHaveLength(levels.length)
      for (const [index, { name, level }] of levels.entries()) {
        await expect(items[index]).toHaveTextContent(`${level}%${name}`)
      }
    })
  },
}

export const Progress: Story = {
  render: () => <RadialChartProgress />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws the progress with its count", async () => {
      await expectSeries(canvasElement, BAR, 1)
      await expect(canvas.getByText("16 / 25")).toBeInTheDocument()
    })
  },
}
