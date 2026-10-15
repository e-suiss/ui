import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { buttonVariants } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import TooltipDemo from "@/examples/tooltip-demo"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const openState = byBase<[string, string?]>({
  base: ["data-open"],
  radix: ["data-state", "instant-open"],
})

function TooltipOpen() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <Tooltip defaultOpen>
          <TooltipTrigger className={buttonVariants({ variant: "outline" })}>
            Hover me
          </TooltipTrigger>
          <TooltipContent side="top">Add to library</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
function TooltipSidesOpen() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <div className="grid grid-cols-2 place-items-center gap-x-24 gap-y-16">
          {(["top", "right", "left", "bottom"] as const).map((side) => (
            <TooltipProvider key={side}>
              <Tooltip defaultOpen>
                <TooltipTrigger
                  className={buttonVariants({ variant: "outline" })}
                >
                  {side}
                </TooltipTrigger>
                <TooltipContent side={side}>Shown on the {side}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
function TooltipWithShortcutOpen() {
  return (
    <TooltipProvider>
      <div className="p-12">
        <Tooltip defaultOpen>
          <TooltipTrigger
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label="New file"
          >
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            New file
            <Kbd mod>N</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<TooltipDemo />)

  const trigger = canvas.getByRole("button", { name: "Hover me" })

  await step("opens on hover and closes on unhover", async () => {
    await userEvent.hover(trigger)
    await waitFor(
      () => expect(screen.getByText("Add to library")).toBeVisible(),
      { timeout: 3000 }
    )
    await userEvent.unhover(trigger)
    await waitFor(() => expect(screen.queryByText("Add to library")).toBeNull())
  })

  await step("opens on keyboard focus and closes with Escape", async () => {
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(
      () => expect(screen.getByText("Add to library")).toBeVisible(),
      { timeout: 3000 }
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByText("Add to library")).toBeNull())
    await expect(trigger).toHaveFocus()
  })
})
test("Open", async () => {
  const { step } = await renderExample(<TooltipOpen />)

  await step("renders the tooltip open on mount", async () => {
    await waitFor(
      () => expect(screen.getByText("Add to library")).toBeVisible(),
      { timeout: 3000 }
    )
  })
})
test("Sides", async () => {
  const { canvas, step } = await renderExample(<TooltipSidesOpen />)

  const sides = ["top", "right", "bottom", "left"] as const

  await step("shows all four tooltips at once", async () => {
    for (const side of sides) {
      await waitFor(() =>
        expect(
          screen
            .getByText(`Shown on the ${side}`)
            .closest('[data-slot="tooltip-content"]')
        ).toHaveAttribute(...openState)
      )
    }
  })

  for (const side of sides) {
    await step(`places the ${side} tooltip on its side`, async () => {
      const trigger = canvas.getByRole("button", { name: side })
      const content = screen.getByText(`Shown on the ${side}`)
      await expect(
        content
          .closest('[data-slot="tooltip-content"]')
          ?.getAttribute("data-side")
      ).toBe(side)
      await waitFor(() => {
        const tip = content.getBoundingClientRect()
        const anchor = trigger.getBoundingClientRect()
        const placements = {
          top: tip.bottom <= anchor.top,
          right: tip.left >= anchor.right,
          bottom: tip.top >= anchor.bottom,
          left: tip.right <= anchor.left,
        }
        expect(placements[side]).toBe(true)
      })
    })
  }
})
test("With Shortcut", async () => {
  const { canvas, step } = await renderExample(<TooltipWithShortcutOpen />)

  await step("names the icon trigger and shows the shortcut", async () => {
    await expect(canvas.getByRole("button", { name: "New file" })).toBeVisible()
    const content = await screen.findByText("New file")
    await expect(content.querySelector('[data-slot="kbd"]')).toHaveTextContent(
      "N"
    )
  })
})
