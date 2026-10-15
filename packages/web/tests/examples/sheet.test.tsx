import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import SheetDemo from "@/examples/sheet-demo"
import SheetSides from "@/examples/sheet-sides"
import { renderExample } from "@/tests/render-example"

type Side = "top" | "right" | "bottom" | "left"
function ProfileSheet({
  side = "right",
  showCloseButton = true,
  closeLabel,
}: {
  side?: Side
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <SheetContent
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
    >
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Update your details and save when you are done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-6">
        <div className="grid gap-2">
          <Label htmlFor="sheet-name">Name</Label>
          <Input id="sheet-name" defaultValue="Jordan Lee" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sheet-username">Username</Label>
          <Input id="sheet-username" defaultValue="@jordanlee" />
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose render={<Button variant="secondary" />}>Cancel</SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

function SheetOpen() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet />
    </Sheet>
  )
}
function SheetOpenLeftOpen() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet side="left" />
    </Sheet>
  )
}
function SheetOpenBottomOpen() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet side="bottom" />
    </Sheet>
  )
}
function SheetWithoutCloseButtonOpen() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet showCloseButton={false} />
    </Sheet>
  )
}
function SheetWithCloseLabelOpen() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet closeLabel="Done" />
    </Sheet>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<SheetDemo />)

  const trigger = canvas.getByRole("button", { name: "Open sheet" })

  await step("opens a named sheet and moves focus into it", async () => {
    await userEvent.click(trigger)
    const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(sheet).toHaveAccessibleDescription(
      "Update your details and save when you are done."
    )
    await waitFor(() =>
      expect(sheet).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step(
    "closes with Escape and returns focus to the trigger",
    async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
    }
  )

  await step("closes from the close button", async () => {
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open", async () => {
  const { step } = await renderExample(<SheetOpen />)

  await step("closes from the cancel button", async () => {
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Sides", async () => {
  const { canvas, step } = await renderExample(<SheetSides />)

  for (const side of ["top", "right", "bottom", "left"]) {
    const label = side.charAt(0).toUpperCase() + side.slice(1)

    await step(`opens and closes the ${side} sheet`, async () => {
      const trigger = canvas.getByRole("button", { name: label })
      await userEvent.click(trigger)
      const sheet = await screen.findByRole("dialog", {
        name: "Edit profile",
      })
      await expect(sheet).toHaveAttribute("data-side", side)
      await waitFor(() => expect(sheet).toBeVisible())
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  }
})
test("Open Left", async () => {
  const { step } = await renderExample(<SheetOpenLeftOpen />)

  await step("renders open on the left side", async () => {
    const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(sheet).toHaveAttribute("data-side", "left")
    await waitFor(() =>
      expect(sheet.getBoundingClientRect().left).toBeLessThan(
        window.innerWidth / 2
      )
    )
  })

  await step("closes from the close button", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open Bottom", async () => {
  const { step } = await renderExample(<SheetOpenBottomOpen />)

  await step("renders open on the bottom side", async () => {
    const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(sheet).toHaveAttribute("data-side", "bottom")
    await waitFor(() =>
      expect(sheet.getBoundingClientRect().top).toBeGreaterThan(
        window.innerHeight / 2
      )
    )
  })

  await step("closes with Escape", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Without Close Button", async () => {
  const { step } = await renderExample(<SheetWithoutCloseButtonOpen />)

  await step("leaves out the icon close button", async () => {
    await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
  })
})
test("With Close Label", async () => {
  const { step } = await renderExample(<SheetWithCloseLabelOpen />)

  await step("closes from the text close button", async () => {
    await userEvent.click(await screen.findByRole("button", { name: "Done" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
