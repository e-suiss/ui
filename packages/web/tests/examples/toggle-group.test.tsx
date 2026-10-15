import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ToggleGroupDemo from "@/examples/toggle-group-demo"
import ToggleGroupDisabled from "@/examples/toggle-group-disabled"
import ToggleGroupSegmented from "@/examples/toggle-group-segmented"
import ToggleGroupSegmentedVertical from "@/examples/toggle-group-segmented-vertical"
import ToggleGroupSingleSelection from "@/examples/toggle-group-single-selection"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

test("Default", async () => {
  const { canvas, step } = await renderExample(<ToggleGroupDemo />)

  const bold = canvas.getByRole("button", { name: "Toggle bold" })
  const italic = canvas.getByRole("button", { name: "Toggle italic" })

  await step("presses several items at once", async () => {
    await expect(bold).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(italic)
    await expect(italic).toHaveAttribute("aria-pressed", "true")
    await expect(bold).toHaveAttribute("aria-pressed", "true")
  })

  await step("moves focus with arrow keys and toggles with Space", async () => {
    await userEvent.keyboard("{ArrowRight}")
    const underline = canvas.getByRole("button", {
      name: "Toggle underline",
    })
    await expect(underline).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(underline).toHaveAttribute("aria-pressed", "true")
  })

  await step("releases an item on a second click", async () => {
    await userEvent.click(bold)
    await expect(bold).toHaveAttribute("aria-pressed", "false")
  })
})
test("Segmented", async () => {
  const { canvas, step } = await renderExample(<ToggleGroupSegmented />)

  const week = canvas.getByRole(SINGLE.role, { name: "Week" })
  const month = canvas.getByRole(SINGLE.role, { name: "Month" })

  await step("names the group and keeps one item pressed", async () => {
    await expect(
      canvas.getByRole(SINGLE.group, { name: "Calendar view" })
    ).toBeVisible()
    await expect(week).toHaveAttribute(SINGLE.pressed, "true")
    await userEvent.click(month)
    await expect(month).toHaveAttribute(SINGLE.pressed, "true")
    await expect(week).toHaveAttribute(SINGLE.pressed, "false")
  })
})
test("Segmented Vertical", async () => {
  const { canvas, step } = await renderExample(<ToggleGroupSegmentedVertical />)

  await step("moves focus with up and down keys", async () => {
    await userEvent.click(canvas.getByRole(SINGLE.role, { name: "Week" }))
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole(SINGLE.role, { name: "Month" })).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await expect(canvas.getByRole(SINGLE.role, { name: "Day" })).toHaveFocus()
  })
})
test("Single Selection", async () => {
  const { canvas, step } = await renderExample(<ToggleGroupSingleSelection />)

  await step("switches the single pressed item", async () => {
    const left = canvas.getByRole(SINGLE.role, { name: "Align left" })
    const right = canvas.getByRole(SINGLE.role, { name: "Align right" })
    await userEvent.click(right)
    await expect(right).toHaveAttribute(SINGLE.pressed, "true")
    await expect(left).toHaveAttribute(SINGLE.pressed, "false")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<ToggleGroupDisabled />)

  await step("disables every item and ignores clicks", async () => {
    for (const item of canvas.getAllByRole("button")) {
      await expect(item).toBeDisabled()
    }
    const italic = canvas.getByRole("button", { name: "Toggle italic" })
    await userEvent.click(italic, { pointerEventsCheck: 0 })
    await expect(italic).toHaveAttribute("aria-pressed", "false")
  })
})
