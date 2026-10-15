import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Flyout,
  FlyoutBody,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FlyoutDemo from "@/examples/flyout-demo"
import FlyoutFloating from "@/examples/flyout-floating"
import FlyoutWithClose from "@/examples/flyout-with-close"
import { renderExample } from "@/tests/render-example"

function FlyoutOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Flyout defaultOpen>
        <FlyoutTrigger className={buttonVariants({ variant: "outline" })}>
          Dimensions
        </FlyoutTrigger>
        <FlyoutContent>
          <FlyoutHeader>
            <FlyoutTitle>Dimensions</FlyoutTitle>
            <FlyoutDescription>
              Set the dimensions for the layer.
            </FlyoutDescription>
          </FlyoutHeader>
          <FlyoutBody className="grid gap-3">
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="flyout-width">Width</Label>
              <Input
                id="flyout-width"
                defaultValue="100%"
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="flyout-height">Height</Label>
              <Input
                id="flyout-height"
                defaultValue="25px"
                className="col-span-2"
              />
            </div>
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<FlyoutDemo />)

  const trigger = canvas.getByRole("button", { name: "Dimensions" })

  await step("opens a named flyout and moves focus in", async () => {
    await userEvent.click(trigger)
    const flyout = await screen.findByRole("dialog", { name: "Dimensions" })
    await expect(flyout).toHaveAccessibleDescription(
      "Set the dimensions for the layer."
    )
    await waitFor(() =>
      expect(flyout).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step("edits a field inside the flyout", async () => {
    const width = screen.getByLabelText("Width")
    await userEvent.clear(width)
    await userEvent.type(width, "320px")
    await expect(width).toHaveValue("320px")
  })

  await step("Escape closes and returns focus to the trigger", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("clicking outside closes it", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("dialog")
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("With Close", async () => {
  const { canvas, step } = await renderExample(<FlyoutWithClose />)

  await step("a close action inside the flyout closes it", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Share" }))
    await screen.findByRole("dialog", { name: "Share link" })
    await userEvent.click(
      await screen.findByRole("button", { name: "Copy link" })
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<FlyoutOpenByDefault />)

  await step("renders open and closes with Escape", async () => {
    await screen.findByRole("dialog", { name: "Dimensions" })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Floating", async () => {
  const { canvas, step } = await renderExample(<FlyoutFloating />)

  const trigger = canvas.getByRole("button", { name: "Dimensions" })

  await step("opens a named flyout and moves focus in", async () => {
    await userEvent.click(trigger)
    const flyout = await screen.findByRole("dialog", { name: "Dimensions" })
    await expect(flyout).toHaveAccessibleDescription(
      "Set the dimensions for the layer."
    )
    await waitFor(() =>
      expect(flyout).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step("edits a field inside the flyout", async () => {
    const width = screen.getByLabelText("Width")
    await userEvent.clear(width)
    await userEvent.type(width, "320px")
    await expect(width).toHaveValue("320px")
  })

  await step("Escape closes and returns focus to the trigger", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("clicking outside closes it", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("dialog")
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
