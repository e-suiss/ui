import { HouseIcon } from "@phosphor-icons/react"
import { Bar, BarChart, XAxis } from "recharts"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, renderHook } from "vitest-browser-react"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "January", desktop: 1860, mobile: 80, device: "desktop" },
  { month: "February", desktop: 305, mobile: 200, device: "mobile" },
]

const config = {
  desktop: { label: "Desktop", color: "rgb(0, 122, 255)" },
  mobile: {
    label: "Mobile",
    theme: { light: "rgb(52, 199, 89)", dark: "rgb(48, 209, 88)" },
  },
} satisfies ChartConfig

afterEach(() => {
  document.documentElement.classList.remove("dark")
})

function chartStyles() {
  return Array.from(
    document.querySelectorAll("style"),
    (style) => style.textContent ?? ""
  ).filter((text) => text.includes("[data-chart="))
}

const styleText = () => chartStyles().join("\n")

const number = (value: number) => value.toLocaleString()

function Chart({
  chartConfig = config,
  tooltip,
  legend,
  keys = ["desktop", "mobile"],
}: {
  chartConfig?: ChartConfig
  tooltip?: React.ComponentProps<typeof ChartTooltipContent>
  legend?: React.ComponentProps<typeof ChartLegendContent>
  keys?: string[]
}) {
  return (
    <div style={{ width: 480 }}>
      <ChartContainer config={chartConfig} id="traffic">
        <BarChart data={data} accessibilityLayer>
          <XAxis dataKey="month" />
          {tooltip && (
            <ChartTooltip
              defaultIndex={0}
              active
              content={<ChartTooltipContent {...tooltip} />}
            />
          )}
          {legend && (
            <ChartLegend
              verticalAlign={legend.verticalAlign ?? "bottom"}
              content={<ChartLegendContent {...legend} />}
            />
          )}
          {keys.map((key) => (
            <Bar key={key} dataKey={key} fill={`var(--color-${key})`} />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

function tooltip() {
  const element = document.querySelector<HTMLElement>(
    ".recharts-tooltip-wrapper > div"
  )
  if (!element) throw new Error("tooltip not rendered")
  return element
}

const tooltipText = () => tooltip().innerText.replace(/\s+/g, " ").trim()

function indicators() {
  return Array.from(
    tooltip().querySelectorAll<HTMLElement>("[style*='--color-bg']")
  )
}

describe("ChartStyle", () => {
  it("scopes a color variable per series for light and dark", async () => {
    await render(<ChartStyle id="chart-sales" config={config} />)
    expect(styleText()).toBe(
      [
        " [data-chart=chart-sales] {",
        " --color-desktop: rgb(0, 122, 255);",
        " --color-mobile: rgb(52, 199, 89);",
        "}",
        ".dark [data-chart=chart-sales] {",
        " --color-desktop: rgb(0, 122, 255);",
        " --color-mobile: rgb(48, 209, 88);",
        "}",
      ].join("\n")
    )
  })

  it("leaves out keys and values that could break out of the rule", async () => {
    await render(
      <ChartStyle
        id="chart-safe"
        config={{
          "a;b": { color: "red" },
          "x}y": { color: "red" },
          broken: { color: "red; } body { display: none" },
          html: { color: "<script>" },
          escaped: { color: "\\61" },
          fine: { color: "var(--green)" },
        }}
      />
    )
    const css = styleText()
    expect(css).toContain("--color-fine: var(--green);")
    expect(css).not.toContain("display")
    expect(css).not.toContain("script")
    expect(css).not.toContain("\\61")
    expect(css).not.toContain("--color-a")
    expect(css).not.toContain("--color-x")
  })

  it("renders nothing when no series has a color", async () => {
    await render(
      <ChartStyle id="chart-plain" config={{ total: { label: "Total" } }} />
    )
    expect(chartStyles()).toEqual([])
  })
})

describe("ChartContainer", () => {
  it("strips unsafe characters from the chart id", async () => {
    await render(
      <div style={{ width: 480 }}>
        <ChartContainer config={config} id="sales: q1 {2026}">
          <BarChart data={data}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      </div>
    )
    const chart = document.querySelector<HTMLElement>("[data-slot=chart]")
    expect(chart?.dataset.chart).toBe("chart-salesq12026")
    expect(styleText()).toContain("[data-chart=chart-salesq12026]")
  })

  it("paints each series with its own color and switches with the theme", async () => {
    await render(<Chart />)
    const bar = (key: string) =>
      document.querySelector<SVGPathElement>(
        `.recharts-bar-rectangle path[fill='var(--color-${key})']`
      )
    await expect
      .poll(
        () => bar("mobile") && getComputedStyle(bar("mobile") as Element).fill
      )
      .toBe("rgb(52, 199, 89)")
    expect(getComputedStyle(bar("desktop") as Element).fill).toBe(
      "rgb(0, 122, 255)"
    )
    document.documentElement.classList.add("dark")
    await expect
      .poll(() => getComputedStyle(bar("mobile") as Element).fill)
      .toBe("rgb(48, 209, 88)")
  })

  it("only lets its parts render inside a container", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(
      renderHook(() => ChartTooltipContent({ active: true, payload: [] }))
    ).rejects.toThrow("useChart must be used within a <ChartContainer />")
    vi.restoreAllMocks()
  })
})

describe("ChartTooltipContent", () => {
  it("shows the label and each series with its configured name and value", async () => {
    await render(<Chart tooltip={{}} />)
    await expect
      .poll(tooltipText)
      .toBe(`January Desktop ${number(1860)} Mobile 80`)
    expect(indicators()).toHaveLength(2)
  })

  it.each([
    ["dot", "10px"],
    ["line", "4px"],
  ] as const)("draws a %s indicator", async (indicator, width) => {
    await render(<Chart tooltip={{ indicator }} />)
    await expect.poll(() => indicators().length).toBe(2)
    expect(getComputedStyle(indicators()[0] as Element).width).toBe(width)
  })

  it("draws a dashed indicator as a border", async () => {
    await render(<Chart tooltip={{ indicator: "dashed" }} />)
    await expect.poll(() => indicators().length).toBe(2)
    expect(getComputedStyle(indicators()[0] as Element).borderStyle).toBe(
      "dashed"
    )
  })

  it("hides the label and the indicators when asked", async () => {
    await render(<Chart tooltip={{ hideLabel: true, hideIndicator: true }} />)
    await expect.poll(tooltipText).toBe(`Desktop ${number(1860)} Mobile 80`)
    expect(indicators()).toHaveLength(0)
  })

  it("nests the label next to a single series with a line indicator", async () => {
    await render(<Chart tooltip={{ indicator: "line" }} keys={["desktop"]} />)
    await expect.poll(tooltipText).toBe(`January Desktop ${number(1860)}`)
    const label = tooltip().querySelector(".font-semibold")
    expect(label?.closest(".grid.gap-1\\.5 .grid")).not.toBeNull()
  })

  it("names series from another field with nameKey and labelKey", async () => {
    await render(
      <Chart
        keys={["desktop"]}
        tooltip={{ nameKey: "device", labelKey: "device" }}
      />
    )
    await expect.poll(tooltipText).toBe(`Desktop Desktop ${number(1860)}`)
  })

  it("lets a formatter replace each row", async () => {
    await render(
      <Chart
        tooltip={{
          formatter: (value, name) => (
            <span>
              {name} is {value}
            </span>
          ),
        }}
      />
    )
    await expect.poll(tooltipText).toBe("January desktop is 1860 mobile is 80")
  })

  it("lets a label formatter change the title", async () => {
    await render(
      <Chart tooltip={{ labelFormatter: (label) => `Month: ${label}` }} />
    )
    await expect.poll(tooltipText).toContain("Month: January")
  })

  it("uses a configured icon instead of the indicator", async () => {
    await render(
      <Chart
        keys={["desktop"]}
        chartConfig={{
          desktop: { label: "Desktop", color: "red", icon: HouseIcon },
        }}
        tooltip={{}}
      />
    )
    await expect.poll(() => tooltip().querySelector("svg")).not.toBeNull()
    expect(indicators()).toHaveLength(0)
  })
})

describe("ChartLegendContent", () => {
  const legend = () =>
    document.querySelector<HTMLElement>(
      ".recharts-legend-wrapper > div"
    ) as HTMLElement

  it("lists each series with its configured label and a color swatch", async () => {
    await render(<Chart legend={{}} />)
    await expect
      .poll(() => legend()?.innerText.replace(/\s+/g, " ").trim())
      .toBe("Desktop Mobile")
    const swatches = legend().querySelectorAll<HTMLElement>(".rounded-xs")
    expect(swatches).toHaveLength(2)
    expect(swatches[0]?.style.backgroundColor).toBe("var(--color-desktop)")
  })

  it("prefers a configured icon unless hideIcon is set", async () => {
    const withIcon = {
      desktop: { label: "Desktop", color: "red", icon: HouseIcon },
    } satisfies ChartConfig
    const { rerender } = await render(
      <Chart chartConfig={withIcon} keys={["desktop"]} legend={{}} />
    )
    await expect.poll(() => legend()?.querySelector("svg")).not.toBeNull()
    await rerender(
      <Chart
        chartConfig={withIcon}
        keys={["desktop"]}
        legend={{ hideIcon: true }}
      />
    )
    await expect.poll(() => legend()?.querySelector("svg")).toBeNull()
    expect(legend().querySelectorAll(".rounded-xs")).toHaveLength(1)
  })

  it("adds space above a bottom legend and below a top one", async () => {
    const { rerender } = await render(<Chart legend={{}} />)
    await expect.poll(() => legend()?.className).toContain("pt-3")
    await rerender(<Chart legend={{ verticalAlign: "top" }} />)
    await expect.poll(() => legend()?.className).toContain("pb-3")
  })
})
