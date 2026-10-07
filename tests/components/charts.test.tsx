import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { AreaChartInteractive } from "@/components/charts/area-chart-interactive"
import { BarChartInteractive } from "@/components/charts/bar-chart-interactive"
import { LineChartInteractive } from "@/components/charts/line-chart-interactive"
import { PieChartInteractive } from "@/components/charts/pie-chart-interactive"
import { RadarChartInteractive } from "@/components/charts/radar-chart-interactive"
import { RadialChartInteractive } from "@/components/charts/radial-chart-interactive"
import { TooltipChartInteractive } from "@/components/charts/tooltip-chart-interactive"

const PRICE = /^\$\d/
const CHANGE = /^[+-]\d+\.\d{2} \(/
const SIZE = /^\d+\.\d GB$/
const SIZE_SUFFIX = /[\d.]+ GB$/

const button = (name: string) => page.getByRole("button", { name, exact: true })

const entry = (term: string) =>
  page.getByRole("term").filter({ hasText: term }).element().parentElement
    ?.textContent ?? ""

const item = (text: string) =>
  page.getByRole("listitem").filter({ hasText: text })

async function pointAt(steps: number) {
  const chart = page.getByRole("application").element()
  if (!(chart instanceof SVGElement)) throw new Error("chart not found")
  chart.focus()
  for (let step = 0; step < steps; step++) {
    await userEvent.keyboard("{ArrowRight}")
  }
}

const axisTicks = (axis: "x" | "y") =>
  Array.from(
    document.querySelectorAll(
      `.recharts-${axis}Axis-tick-labels .recharts-cartesian-axis-tick-value`
    ),
    (tick) => tick.textContent
  )

describe("BarChartInteractive", () => {
  it("shows the weekly daily average and its category breakdown", async () => {
    await render(<BarChartInteractive />)
    await expect.element(page.getByText("Daily average")).toBeVisible()
    await expect.element(page.getByText("3h 55m")).toBeVisible()
    await expect.element(page.getByText("8% less than last week")).toBeVisible()
    expect(entry("Social")).toBe("Social1h 9m")
    expect(entry("Productivity")).toBe("Productivity1h 24m")
    expect(entry("Entertainment")).toBe("Entertainment1h 22m")
    expect(
      page
        .getByRole("listitem")
        .elements()
        .map((row) => row.textContent)
    ).toEqual(["Video49m", "Chat38m", "Browser38m", "Music33m", "Messages31m"])
    expect(axisTicks("x")).toEqual([
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ])
  })

  it("selects a day from the keyboard and compares it with the average", async () => {
    await render(<BarChartInteractive />)
    await pointAt(2)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Wednesday")).toBeVisible()
    await expect.element(page.getByText("4h 13m")).toBeVisible()
    await expect.element(page.getByText("8% above average")).toBeVisible()
    expect(entry("Social")).toBe("Social1h 10m")
    expect(entry("Productivity")).toBe("Productivity1h 28m")
    expect(entry("Entertainment")).toBe("Entertainment1h 35m")
    await expect.element(item("Video")).toHaveTextContent("Video57m")
  })

  it("reports days below the average and clears the selection when pressed again", async () => {
    await render(<BarChartInteractive />)
    await pointAt(0)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Monday")).toBeVisible()
    await expect.element(page.getByText("3h 25m")).toBeVisible()
    await expect.element(page.getByText("13% below average")).toBeVisible()
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Daily average")).toBeVisible()
    await expect.element(page.getByText("3h 55m")).toBeVisible()
  })

  it("switches to an hourly view of Sunday when nothing is selected", async () => {
    await render(<BarChartInteractive />)
    await button("Day").click()
    await expect.element(button("Day")).toHaveAttribute("aria-pressed", "true")
    await expect.element(page.getByText("Sunday")).toBeVisible()
    await expect.element(page.getByText("4h 0m")).toBeVisible()
    await expect.element(page.getByText("2% above average")).toBeVisible()
    expect(entry("Social")).toBe("Social1h 35m")
    expect(entry("Productivity")).toBe("Productivity25m")
    expect(entry("Entertainment")).toBe("Entertainment2h 0m")
    await expect
      .poll(() => axisTicks("x"))
      .toEqual(["0:00", "6:00", "12:00", "18:00"])
  })

  it("keeps the selected day in the hourly view and ignores presses there", async () => {
    await render(<BarChartInteractive />)
    await pointAt(5)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Saturday")).toBeVisible()
    await button("Day").click()
    await expect.poll(() => axisTicks("x")).toContain("12:00")
    await expect.element(page.getByText("4h 40m")).toBeVisible()
    await expect.element(page.getByText("19% above average")).toBeVisible()
    await pointAt(1)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Saturday")).toBeVisible()
    await button("Week").click()
    await expect.poll(() => axisTicks("x")).toContain("Sat")
    await expect.element(page.getByText("Saturday")).toBeVisible()
  })
})

describe("AreaChartInteractive", () => {
  const headline = () => page.getByText(PRICE)
  const change = () => page.getByText(CHANGE)

  it("opens on the past month with the current price and its change", async () => {
    await render(<AreaChartInteractive />)
    await expect.element(button("1M")).toHaveAttribute("aria-pressed", "true")
    await expect.element(headline()).toHaveTextContent("$254.32")
    await expect.element(change()).toHaveTextContent("-0.96 (0.38%)")
    await expect.element(change()).toHaveAttribute("data-trend", "down")
    await expect.element(page.getByText("Past month")).toBeVisible()
    expect(entry("Open")).toBe("Open255.28")
    expect(entry("High")).toBe("High259.54")
    expect(entry("Low")).toBe("Low254.32")
    expect(entry("Volume")).toBe("Volume1.24B")
  })

  it.each([
    ["1D", "Today", "+2.44 (0.97%)", "up", "251.88", "41.2M"],
    ["1W", "Past week", "-1.25 (0.49%)", "down", "255.57", "1.24B"],
    ["3M", "Past 3 months", "+18.33 (7.77%)", "up", "235.99", "1.24B"],
    ["1Y", "Past year", "+8.94 (3.64%)", "up", "245.38", "1.24B"],
    ["5Y", "Past 5 years", "+65.89 (34.97%)", "up", "188.43", "1.24B"],
  ])(
    "measures the %s range from its opening price",
    async (range, caption, delta, trend, open, volume) => {
      await render(<AreaChartInteractive />)
      await button(range).click()
      await expect.element(page.getByText(caption)).toBeVisible()
      await expect.element(headline()).toHaveTextContent("$254.32")
      await expect.element(change()).toHaveTextContent(delta)
      await expect.element(change()).toHaveAttribute("data-trend", trend)
      expect(entry("Open")).toBe(`Open${open}`)
      expect(entry("Volume")).toBe(`Volume${volume}`)
    }
  )

  it("relabels the time axis for each range", async () => {
    await render(<AreaChartInteractive />)
    await button("1D").click()
    await expect.poll(() => axisTicks("x")).toContain("10:00")
    expect(axisTicks("x").every((tick) => tick?.endsWith(":00"))).toBe(true)
    await button("1W").click()
    await expect.poll(() => axisTicks("x")).toContain("Mon")
    await button("5Y").click()
    await expect.poll(() => axisTicks("x")).toContain("2026")
    expect(axisTicks("x")).toContain("2022")
  })

  it("rescales the price axis once the morph settles", async () => {
    await render(<AreaChartInteractive />)
    await button("5Y").click()
    await expect
      .poll(() => axisTicks("y").map(Number))
      .toSatisfy((ticks: number[]) => Math.min(...ticks) < 200)
  })

  it("shows the pointed price and its change against the opening price", async () => {
    await render(<AreaChartInteractive />)
    await pointAt(0)
    await expect.element(headline()).toHaveTextContent("$255.28")
    await expect.element(change()).toHaveTextContent("+0.00 (0.00%)")
    await expect.element(page.getByText("Past month")).not.toBeInTheDocument()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(headline()).toHaveTextContent("$255.55")
    await expect.element(change()).toHaveTextContent("+0.27 (0.11%)")
  })
})

describe("PieChartInteractive", () => {
  it("keeps its slices in place once it has rendered", async () => {
    let removed = 0
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.removedNodes) {
          if (
            node instanceof Element &&
            (node.matches(".recharts-pie-sector") ||
              node.querySelector(".recharts-pie-sector"))
          ) {
            removed++
          }
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    await render(<PieChartInteractive />)
    await expect
      .poll(() => document.querySelectorAll(".recharts-pie-sector").length)
      .toBeGreaterThan(0)
    removed = 0
    await new Promise((resolve) => setTimeout(resolve, 800))
    observer.disconnect()
    expect(removed).toBe(0)
  })

  const center = () => page.getByText(SIZE).first()

  it("totals the used space of the phone", async () => {
    await render(<PieChartInteractive />)
    await expect.element(page.getByText("Phone storage")).toBeVisible()
    await expect
      .element(page.getByText("152.4 GB of 256 GB used"))
      .toBeVisible()
    await expect.element(page.getByText("Used")).toBeVisible()
    await expect.element(page.getByText("60%")).toBeVisible()
    await expect.element(item("Free")).toHaveTextContent("Free103.6 GB")
    await expect.element(item("Apps")).toHaveTextContent("Apps62.4 GB")
  })

  it("lists only the kinds the device uses", async () => {
    await render(<PieChartInteractive />)
    const present = () =>
      page
        .getByRole("listitem")
        .elements()
        .filter((row) => row.hasAttribute("data-present"))
        .map((row) => row.textContent?.replace(SIZE_SUFFIX, ""))
    await expect
      .poll(present)
      .toEqual(["Apps", "Photos", "System", "Messages", "Other", "Free"])
    await button("Cloud").click()
    await expect
      .poll(present)
      .toEqual(["Photos", "Backups", "Drive", "Messages", "Mail", "Free"])
  })

  it("morphs every size to the cloud storage", async () => {
    await render(<PieChartInteractive />)
    await button("Cloud").click()
    await expect
      .element(button("Cloud"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.element(page.getByText("Cloud storage")).toBeVisible()
    await expect
      .element(page.getByText("156.5 GB of 200 GB used"))
      .toBeVisible()
    await expect.element(page.getByText("78%")).toBeVisible()
    await expect.element(item("Photos")).toHaveTextContent("Photos96.2 GB")
    await expect.element(item("Free")).toHaveTextContent("Free43.5 GB")
    await expect.element(item("Apps")).toHaveTextContent("Apps0.0 GB")
  })

  it("shows the size and share of the pointed kind", async () => {
    await render(<PieChartInteractive />)
    await item("Photos").hover()
    await expect.element(center()).toHaveTextContent("48.1 GB")
    await expect.element(page.getByText("19%")).toBeVisible()
    await item("Free").hover()
    await expect.element(center()).toHaveTextContent("103.6 GB")
    await expect.element(page.getByText("40%")).toBeVisible()
    await page.getByText("Phone storage").hover()
    await expect.element(center()).toHaveTextContent("152.4 GB")
    await expect.element(page.getByText("Used")).toBeVisible()
  })
})

describe("RadarChartInteractive", () => {
  const card = (model: string) =>
    page
      .getByRole("listitem")
      .elements()
      .find((row) => row.querySelector(".text-base")?.textContent === model)

  const shown = () =>
    page
      .getByRole("listitem")
      .elements()
      .filter((row) => row.hasAttribute("data-shown"))
      .map((row) => row.textContent)

  it("compares the overall scores of the selected models", async () => {
    await render(<RadarChartInteractive />)
    await expect
      .element(button("Phone Pro"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(button("Phone Air"))
      .toHaveAttribute("aria-pressed", "true")
    expect(shown()).toEqual([
      "Phone ProOverall score82",
      "Phone AirOverall score82",
    ])
    expect(card("Phone Lite")?.textContent).toBe("Phone LiteOverall score79")
  })

  it("keeps at most three models and replaces the oldest", async () => {
    await render(<RadarChartInteractive />)
    await button("Phone").click()
    await expect
      .poll(shown)
      .toEqual([
        "Phone ProOverall score82",
        "PhoneOverall score83",
        "Phone AirOverall score82",
      ])
    await button("Phone Lite").click()
    await expect
      .element(button("Phone Pro"))
      .toHaveAttribute("aria-pressed", "false")
    await expect
      .poll(shown)
      .toEqual([
        "PhoneOverall score83",
        "Phone AirOverall score82",
        "Phone LiteOverall score79",
      ])
  })

  it("never deselects the last model", async () => {
    await render(<RadarChartInteractive />)
    await button("Phone Pro").click()
    await expect.poll(shown).toEqual(["Phone AirOverall score82"])
    await button("Phone Air").click()
    await expect
      .element(button("Phone Air"))
      .toHaveAttribute("aria-pressed", "true")
    expect(shown()).toEqual(["Phone AirOverall score82"])
  })

  it("shows each model's score on the pointed axis", async () => {
    await render(<RadarChartInteractive />)
    await pointAt(0)
    await expect.poll(shown).toEqual(["Phone ProCamera98", "Phone AirCamera78"])
    await userEvent.keyboard("{ArrowRight}")
    await expect
      .poll(shown)
      .toEqual(["Phone ProBattery90", "Phone AirBattery68"])
  })
})

describe("RadialChartInteractive", () => {
  it("fills the rings for Sunday", async () => {
    await render(<RadialChartInteractive />)
    await expect
      .element(button("Sunday"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.poll(() => entry("Move")).toBe("Move486/600kcal81%")
    expect(entry("Exercise")).toBe("Exercise24/30min80%")
    expect(entry("Stand")).toBe("Stand10/12hr83%")
  })

  it("animates to the picked day and flags met goals", async () => {
    await render(<RadialChartInteractive />)
    await button("Saturday").click()
    await expect.element(page.getByText("120% · goal met")).toBeVisible()
    await expect
      .poll(() => entry("Move"))
      .toBe("Move720/600kcal120% · goal met")
    expect(entry("Exercise")).toBe("Exercise62/30min207% · goal met")
    expect(entry("Stand")).toBe("Stand12/12hr100% · goal met")
  })

  it("passes through intermediate values while the rings fill", async () => {
    await render(<RadialChartInteractive />)
    await expect.poll(() => entry("Move")).toBe("Move486/600kcal81%")
    await button("Wednesday").click()
    const seen = new Set<string>()
    await expect
      .poll(() => {
        seen.add(entry("Move"))
        return entry("Move")
      })
      .toBe("Move380/600kcal63%")
    expect(seen.size).toBeGreaterThan(1)
  })
})

describe("LineChartInteractive", () => {
  it("shows the yearly low and high of each visible city", async () => {
    await render(<LineChartInteractive />)
    await expect
      .element(page.getByText("Average · °C · long-term"))
      .toBeVisible()
    expect(entry("Istanbul")).toBe("Istanbul6° / 24°")
    expect(entry("Ankara")).toBe("Ankara0° / 24°")
    expect(entry("Antalya")).toBe("Antalya10° / 29°")
    expect(page.getByRole("term").elements()).toHaveLength(3)
  })

  it("shows the temperature of the pointed month", async () => {
    await render(<LineChartInteractive />)
    await pointAt(0)
    await expect.poll(() => entry("Istanbul")).toBe("Istanbul6° · January")
    expect(entry("Antalya")).toBe("Antalya10° · January")
    await pointAt(6)
    await expect.poll(() => entry("Istanbul")).toBe("Istanbul24° · July")
    expect(entry("Ankara")).toBe("Ankara24° · July")
  })

  it("switches between average, high and low temperatures", async () => {
    await render(<LineChartInteractive />)
    await button("High").click()
    await expect.element(page.getByText("High · °C · long-term")).toBeVisible()
    expect(entry("Istanbul")).toBe("Istanbul9° / 29°")
    expect(entry("Ankara")).toBe("Ankara6° / 34°")
    await button("Low").click()
    await expect.element(page.getByText("Low · °C · long-term")).toBeVisible()
    expect(entry("Ankara")).toBe("Ankara-6° / 14°")
    expect(entry("Antalya")).toBe("Antalya6° / 22°")
  })

  it("adds and removes cities but keeps at least one", async () => {
    await render(<LineChartInteractive />)
    await button("Erzurum").click()
    await expect.poll(() => entry("Erzurum")).toBe("Erzurum-9° / 20°")
    await button("Istanbul").click()
    await button("Ankara").click()
    await button("Antalya").click()
    await expect.poll(() => page.getByRole("term").elements()).toHaveLength(1)
    await button("Erzurum").click()
    await expect
      .element(button("Erzurum"))
      .toHaveAttribute("aria-pressed", "true")
    expect(entry("Erzurum")).toBe("Erzurum-9° / 20°")
  })
})

describe("TooltipChartInteractive", () => {
  const tooltip = () => document.querySelector(".recharts-tooltip-wrapper")

  it("opens on Q1 26 with the quarter total in the title", async () => {
    await render(<TooltipChartInteractive />)
    await expect.poll(() => tooltip()?.textContent).toContain("Q1 26109.6B")
    expect(tooltip()?.textContent).toContain("Phones71")
  })

  it("sums the pointed quarter", async () => {
    await render(<TooltipChartInteractive />)
    await pointAt(0)
    await expect.poll(() => tooltip()?.textContent).toContain("Q1 25104.4B")
    await pointAt(7)
    await expect.poll(() => tooltip()?.textContent).toContain("Q4 2689.5B")
  })

  it("drops the total or the whole title when switched off", async () => {
    await render(<TooltipChartInteractive />)
    await expect.poll(() => tooltip()?.textContent).toContain("109.6B")
    await page.getByRole("switch", { name: "Total in title" }).click()
    await expect.poll(() => tooltip()?.textContent).not.toContain("109.6B")
    expect(tooltip()?.textContent).toContain("Q1 26")
    await page.getByRole("switch", { name: "Hide title" }).click()
    await expect.poll(() => tooltip()?.textContent).not.toContain("Q1 26")
  })
})
