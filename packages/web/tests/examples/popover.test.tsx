import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import PopoverDemo from "@/examples/popover-demo"
import PopoverSides from "@/examples/popover-sides"
import PopoverSimple from "@/examples/popover-simple"
import { renderExample } from "@/tests/render-example"

const SHARED_LINKS = /^Shared links stay active for 30 days/

function PopoverOpenByDefault() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-width">Width</Label>
            <Input
              id="popover-width"
              defaultValue="100%"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-height">Height</Label>
            <Input
              id="popover-height"
              defaultValue="25px"
              className="col-span-2"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<PopoverDemo />)

  const trigger = canvas.getByRole("button", { name: "Open popover" })

  await step("opens a named popover from the trigger", async () => {
    await userEvent.click(trigger)
    const popover = await screen.findByRole("dialog", { name: "Dimensions" })
    await expect(popover).toHaveAccessibleDescription(
      "Set the dimensions for the layer."
    )
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  await step("lets the user edit a field inside", async () => {
    const width = screen.getByRole("textbox", { name: "Width" })
    await userEvent.clear(width)
    await userEvent.type(width, "50%")
    await expect(width).toHaveValue("50%")
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  await step("closes on an outside click", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("dialog", { name: "Dimensions" })
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<PopoverOpenByDefault />)

  await step("renders the popover open on mount", async () => {
    await waitFor(
      () =>
        expect(
          screen.getByRole("dialog", { name: "Dimensions" })
        ).toBeVisible(),
      { timeout: 3000 }
    )
  })
})
test("Sides", async () => {
  const { canvas, step } = await renderExample(<PopoverSides />)

  await step("opens each side's popover on its own", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Left" }))
    const popover = await screen.findByRole("dialog", { name: "Heads up" })
    await expect(popover).toHaveTextContent(
      "This popover opens on the left side."
    )
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Simple", async () => {
  const { canvas, step } = await renderExample(<PopoverSimple />)

  const trigger = canvas.getByRole("button", { name: "What is this?" })

  await step("opens from the trigger", async () => {
    await userEvent.click(trigger)
    const popover = await screen.findByRole("dialog")
    await waitFor(() => expect(popover).toBeVisible())
    await expect(popover.textContent).toMatch(SHARED_LINKS)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
  })

  await step("closes from the trigger", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("dialog")
    await userEvent.click(trigger)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
