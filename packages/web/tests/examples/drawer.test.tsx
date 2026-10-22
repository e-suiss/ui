import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import DrawerDemo from "@/examples/drawer-demo"
import DrawerDirections from "@/examples/drawer-directions"
import DrawerFloating from "@/examples/drawer-floating"
import DrawerNonModal from "@/examples/drawer-non-modal"
import DrawerSheetWithDetents from "@/examples/drawer-sheet-with-detents"
import DrawerWithCloseButton from "@/examples/drawer-with-close-button"
import DrawerWithCloseLabel from "@/examples/drawer-with-close-label"
import DrawerWithSnapPoints from "@/examples/drawer-with-snap-points"
import { renderExample } from "@/tests/render-example"

function DrawerOpenByDefault() {
  return (
    <Drawer
      swipeDirection="down"
      floating={false}
      showSwipeHandle
      modal
      defaultOpen
    >
      <DrawerTrigger className={buttonVariants({ variant: "outline" })}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-5xl font-semibold tracking-tight">350</span>
          <span className="text-muted-foreground text-xs uppercase">
            Calories per day
          </span>
        </div>
        <DrawerFooter>
          <Button>Save goal</Button>
          <DrawerClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<DrawerDemo />)

  const trigger = canvas.getByRole("button", { name: "Open drawer" })

  await step("opens a named drawer and moves focus in", async () => {
    await userEvent.click(trigger)
    const drawer = await screen.findByRole("dialog", { name: "Move goal" })
    await expect(drawer).toHaveAccessibleDescription(
      "Set your daily activity goal."
    )
    await waitFor(() =>
      expect(drawer).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("closes from the cancel button", async () => {
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  await renderExample(<DrawerOpenByDefault />)

  const drawer = await screen.findByRole("dialog", { name: "Move goal" })
  await waitFor(() => expect(drawer).toBeVisible())
})
test("Directions", async () => {
  const { canvas, step } = await renderExample(<DrawerDirections />)

  const edges = {
    down: (rect: DOMRect) => rect.bottom - window.innerHeight,
    up: (rect: DOMRect) => rect.top,
    left: (rect: DOMRect) => rect.left,
    right: (rect: DOMRect) => rect.right - window.innerWidth,
  }

  for (const [direction, edgeGap] of Object.entries(edges)) {
    const label = direction.charAt(0).toUpperCase() + direction.slice(1)

    await step(`opens the ${direction} drawer from its edge`, async () => {
      const trigger = canvas.getByRole("button", { name: label })
      await userEvent.click(trigger)
      const drawer = await screen.findByRole("dialog", {
        name: "Notifications",
      })
      await expect(drawer).toHaveAttribute("data-swipe-direction", direction)
      const inset = Number.parseFloat(getComputedStyle(drawer).marginTop) || 0
      await waitFor(() =>
        expect(
          Math.abs(Math.abs(edgeGap(drawer.getBoundingClientRect())) - inset)
        ).toBeLessThan(1)
      )
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  }
})
test("Directions Right To Left", async () => {
  const { canvas, step } = await renderExample(<DrawerDirections />, {
    direction: "rtl",
  })

  const edges = {
    down: (rect: DOMRect) => rect.bottom - window.innerHeight,
    up: (rect: DOMRect) => rect.top,
    left: (rect: DOMRect) => rect.left,
    right: (rect: DOMRect) => rect.right - window.innerWidth,
  }

  for (const [direction, edgeGap] of Object.entries(edges)) {
    const label = direction.charAt(0).toUpperCase() + direction.slice(1)

    await step(`opens the ${direction} drawer from its edge`, async () => {
      const trigger = canvas.getByRole("button", { name: label })
      await userEvent.click(trigger)
      const drawer = await screen.findByRole("dialog", {
        name: "Notifications",
      })
      await expect(drawer).toHaveAttribute("data-swipe-direction", direction)
      const inset = Number.parseFloat(getComputedStyle(drawer).marginTop) || 0
      await waitFor(() =>
        expect(
          Math.abs(Math.abs(edgeGap(drawer.getBoundingClientRect())) - inset)
        ).toBeLessThan(1)
      )
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  }
})
test("With Close Button", async () => {
  const { canvas } = await renderExample(<DrawerWithCloseButton />)

  await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
  await userEvent.click(await screen.findByRole("button", { name: "Close" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
})
test("With Close Label", async () => {
  const { canvas } = await renderExample(<DrawerWithCloseLabel />)

  await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
  const close = await screen.findByRole("button", { name: "Close" })
  await expect(close).toHaveTextContent("Close")
  await userEvent.click(close)
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
})
test("Floating", async () => {
  const { canvas, step } = await renderExample(<DrawerFloating />)

  const trigger = canvas.getByRole("button", { name: "Open drawer" })

  await step("opens inset from the screen edges", async () => {
    await userEvent.click(trigger)
    const drawer = await screen.findByRole("dialog", { name: "Move goal" })
    await expect(drawer).toHaveAttribute("data-floating")
    await waitFor(() => {
      const rect = drawer.getBoundingClientRect()
      expect(rect.left).toBeGreaterThan(0)
      expect(window.innerHeight - rect.bottom).toBeGreaterThan(0)
    })
  })

  await step("closes from the cancel button", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
test("With Snap Points", async () => {
  const { canvas, step } = await renderExample(<DrawerWithSnapPoints />)

  await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }))
  const drawer = await screen.findByRole("dialog", { name: "Move goal" })

  await step("opens at the first snap point", async () => {
    await expect(drawer).toHaveAttribute("data-snap-points")
    await expect(drawer).not.toHaveAttribute("data-expanded")
    await waitFor(() =>
      expect(drawer.getBoundingClientRect().top).toBeCloseTo(
        window.innerHeight / 2,
        -1
      )
    )
  })

  await step("expands to the next snap point when dragged up", async () => {
    const handle = drawer.querySelector(
      '[data-slot="drawer-swipe-handle"]'
    ) as HTMLElement
    const rect = handle.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: handle, coords: { x, y } },
      { target: handle, coords: { x, y: y - 100 } },
      { target: handle, coords: { x, y: y - 300 } },
      { target: handle, coords: { x, y: y - 400 } },
      { keys: "[/MouseLeft]", target: handle, coords: { x, y: y - 400 } },
    ])
    await waitFor(() => expect(drawer).toHaveAttribute("data-expanded"))
  })
})
test("Non Modal", async () => {
  const { canvas } = await renderExample(<DrawerNonModal />)

  const trigger = canvas.getByRole("button", { name: "Open drawer" })
  await userEvent.click(trigger)
  const drawer = await screen.findByRole("dialog", { name: "Move goal" })
  await expect(drawer).not.toHaveAttribute("aria-modal", "true")
  await userEvent.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
})
test("Sheet With Detents", async () => {
  const { canvas, step } = await renderExample(<DrawerSheetWithDetents />)

  const trigger = canvas.getByRole("button", { name: "New event" })

  await step("opens the sheet from the plus button", async () => {
    await userEvent.click(trigger)
    await expect(
      await screen.findByRole("dialog", { name: "New Event" })
    ).toBeInTheDocument()
  })

  await step("toggles the all-day switch", async () => {
    const allDay = screen.getByRole("switch", { name: "All-day" })
    await userEvent.click(allDay)
    await expect(allDay).toBeChecked()
    await expect(screen.getAllByText("Oct 14")).toHaveLength(2)
  })

  await step("closes from the add button", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Add" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
