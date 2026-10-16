import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Slider } from "@/components/ui/slider"

describe("Slider", () => {
  it("renders one thumb for a scalar value", async () => {
    await render(<Slider defaultValue={40} aria-label="Volume" />)
    await expect
      .element(page.getByRole("slider"))
      .toHaveAttribute("aria-valuenow", "40")
    expect(page.getByRole("slider").all()).toHaveLength(1)
  })

  it("renders one thumb per value in a range", async () => {
    await render(<Slider value={[20, 80]} aria-label="Price" />)
    expect(page.getByRole("slider").all()).toHaveLength(2)
  })
})
