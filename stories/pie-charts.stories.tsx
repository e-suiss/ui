import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

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

const DRAWN_PATH = /^M\s?-?\d/
const SECTOR = ".recharts-pie-sector .recharts-sector"

const devices = [
  { label: "Phone", users: 275 },
  { label: "Laptop", users: 200 },
  { label: "Tablet", users: 187 },
  { label: "Watch", users: 173 },
  { label: "Other", users: 90 },
]

const gigabytes = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

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

function sectorAt(root: HTMLElement, index: number) {
  const sector = root.querySelectorAll(".recharts-pie-sector")[index]
  if (!(sector instanceof SVGElement)) {
    throw new Error(`No pie sector at ${index}`)
  }
  return sector
}

async function hoverSector(root: HTMLElement, index: number, texts: string[]) {
  await waitFor(
    async () => {
      await userEvent.hover(sectorAt(root, index))
      const tooltip = root.querySelector(".recharts-tooltip-wrapper")
      for (const text of texts) {
        expect(tooltip).toHaveTextContent(text)
      }
    },
    { timeout: 3000 }
  )
}

async function hoverDevice(root: HTMLElement, index: number) {
  const device = devices[index]
  if (!device) throw new Error(`No device at ${index}`)
  await hoverSector(root, index, [device.label, device.users.toLocaleString()])
}

async function playDevices(root: HTMLElement, step: StepFunction) {
  await step("draws a slice per device", async () => {
    await expectSeries(root, SECTOR, devices.length)
  })

  await step("names the hovered slice in the tooltip", async () => {
    await hoverDevice(root, 1)
  })
}

type StepFunction = (
  label: string,
  play: () => Promise<void>
) => Promise<void> | void

export const Interactive: Story = {
  parameters: { wide: true },
  render: () => <PieChartInteractive />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("draws a slice per storage kind", async () => {
      await expectSeries(canvasElement, SECTOR, 6)
      await expect(
        canvas.getByText(`${gigabytes.format(152.4)} GB of 256 GB used`)
      ).toBeInTheDocument()
    })

    await step("reads out the hovered slice in the middle", async () => {
      const title = canvas.getByText("Phone storage")
      const readout = canvasElement.querySelector("[aria-live]")
      await expect(readout).toHaveTextContent("Used")
      await waitFor(
        async () => {
          await userEvent.hover(title)
          await userEvent.hover(sectorAt(canvasElement, 0))
          expect(readout).toHaveTextContent(`Apps${gigabytes.format(62.4)} GB`)
        },
        { timeout: 3000 }
      )
    })

    await step("switches to the cloud device", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Cloud" }))
      await expect(
        canvas.getByRole("button", { name: "Cloud" })
      ).toHaveAttribute("aria-pressed", "true")
      await expect(await canvas.findByText("Cloud storage")).toBeInTheDocument()
      await waitFor(
        () =>
          expect(
            canvas.getByText(`${gigabytes.format(156.5)} GB of 200 GB used`)
          ).toBeInTheDocument(),
        { timeout: 3000 }
      )
    })
  },
}

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)
  },
}

export const Donut: Story = {
  render: () => <PieChartDonut />,
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)
  },
}

export const DonutText: Story = {
  render: () => <PieChartDonutText />,
  play: async ({ canvas, canvasElement, step }) => {
    await playDevices(canvasElement, step)

    await step("prints the total inside the ring", async () => {
      const total = devices.reduce((sum, device) => sum + device.users, 0)
      await expect(
        canvas.getByText(total.toLocaleString("en-US"))
      ).toBeInTheDocument()
    })
  },
}

export const Label: Story = {
  render: () => <PieChartLabel />,
  play: async ({ canvas, canvasElement, step }) => {
    await playDevices(canvasElement, step)

    await step("names each slice outside the pie", async () => {
      for (const device of devices) {
        await expect(
          await canvas.findByText(
            device.label,
            { selector: "text" },
            { timeout: 3000 }
          )
        ).toBeInTheDocument()
      }
    })
  },
}

export const Active: Story = {
  render: () => <PieChartActive />,
  play: async ({ canvasElement, step }) => {
    await step("draws every slice and lifts the first one", async () => {
      await expectSeries(canvasElement, SECTOR, devices.length + 1)
      await expect(
        sectorAt(canvasElement, 0).querySelectorAll(".recharts-sector")
      ).toHaveLength(2)
    })

    await step("names the hovered slice in the tooltip", async () => {
      await hoverDevice(canvasElement, 2)
    })
  },
}

export const Half: Story = {
  render: () => <PieChartHalf />,
  play: async ({ canvasElement, step }) => {
    await step("draws a slice per device", async () => {
      await expectSeries(canvasElement, SECTOR, 4)
    })

    await step("shows the hovered share in the tooltip", async () => {
      await hoverSector(canvasElement, 1, ["Laptop · 25%"])
    })
  },
}

export const Nested: Story = {
  render: () => <PieChartNested />,
  play: async ({ canvasElement, step }) => {
    await step("draws the inner groups and the outer details", async () => {
      await expectSeries(canvasElement, SECTOR, devices.length + 2)
    })

    await step("names the hovered group in the tooltip", async () => {
      await hoverSector(canvasElement, 1, ["Watch", (450).toLocaleString()])
    })

    await step("names the hovered detail in the tooltip", async () => {
      await hoverSector(canvasElement, 2, ["Phone", (275).toLocaleString()])
    })
  },
}

export const Legend: Story = {
  render: () => <PieChartLegend />,
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)

    await step("lists every device in the legend", async () => {
      await waitFor(() => {
        const legend = canvasElement.querySelector(".recharts-legend-wrapper")
        for (const device of devices) {
          expect(legend).toHaveTextContent(device.label)
        }
      })
    })
  },
}

export const Separated: Story = {
  render: () => <PieChartSeparated />,
  play: async ({ canvasElement, step }) => {
    await playDevices(canvasElement, step)
  },
}
