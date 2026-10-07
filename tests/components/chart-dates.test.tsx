import { afterEach, describe, expect, it } from "vitest"
import { cdp } from "vitest/browser"
import { render } from "vitest-browser-react"

async function loadIn(zone: string) {
  await cdp().send("Emulation.setTimezoneOverride", { timezoneId: zone })
  const query = `?zone=${encodeURIComponent(zone)}`
  const formatter: typeof import("@/components/charts/tooltip-chart-formatter") =
    await import(
      /* @vite-ignore */ `/components/charts/tooltip-chart-formatter.tsx${query}`
    )
  const labelFormatter: typeof import("@/components/charts/tooltip-chart-label-formatter") =
    await import(
      /* @vite-ignore */ `/components/charts/tooltip-chart-label-formatter.tsx${query}`
    )
  return {
    TooltipChartFormatter: formatter.TooltipChartFormatter,
    TooltipChartLabelFormatter: labelFormatter.TooltipChartLabelFormatter,
  }
}

const ZONES = [
  "Pacific/Kiritimati",
  "Asia/Tokyo",
  "Europe/Istanbul",
  "UTC",
  "America/Los_Angeles",
  "Pacific/Pago_Pago",
]

function ticks() {
  return Array.from(
    document.querySelectorAll(".recharts-cartesian-axis-tick-value"),
    (tick) => tick.textContent
  )
}

function tooltip() {
  return document.querySelector(".recharts-tooltip-wrapper")?.textContent ?? ""
}

afterEach(async () => {
  await cdp().send("Emulation.setTimezoneOverride", { timezoneId: "" })
})

describe("chart dates", () => {
  it.each(ZONES)(
    "keeps the label formatter on its own days in %s",
    async (zone) => {
      const { TooltipChartLabelFormatter } = await loadIn(zone)
      await render(<TooltipChartLabelFormatter />)
      await expect.poll(() => ticks()[0]).toBe("23")
      await expect.poll(tooltip).toContain("October 1")
    }
  )

  it.each(ZONES)("keeps the formatter's weekdays in %s", async (zone) => {
    const { TooltipChartFormatter } = await loadIn(zone)
    await render(<TooltipChartFormatter />)
    await expect.poll(() => ticks().slice(0, 3)).toEqual(["Wed", "Thu", "Fri"])
  })
})
