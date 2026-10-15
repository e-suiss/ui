import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/patterns/modal"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ModalDemo from "@/examples/modal-demo"
import ModalFloating from "@/examples/modal-floating"
import ModalWithCloseButton from "@/examples/modal-with-close-button"
import ModalWithCloseLabel from "@/examples/modal-with-close-label"
import { renderExample } from "@/tests/render-example"

function ModalOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Modal defaultOpen>
        <ModalTrigger className={buttonVariants({ variant: "outline" })}>
          Edit profile
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalDescription>
              Update your name and username. Click save when you are done.
            </ModalDescription>
          </ModalHeader>
          <ModalBody className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="modal-name">Name</Label>
              <Input id="modal-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modal-username">Username</Label>
              <Input id="modal-username" defaultValue="@ada" />
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose className={buttonVariants({ variant: "secondary" })}>
              Cancel
            </ModalClose>
            <Button>Save changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<ModalDemo />)

  const trigger = canvas.getByRole("button", { name: "Edit profile" })

  await step("opens a named modal with its form", async () => {
    await userEvent.click(trigger)
    const modal = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(modal).toHaveAccessibleDescription(
      "Update your name and username. Click save when you are done."
    )
    await expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace")
  })

  await step(
    "closes with Escape and returns focus to the trigger",
    async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
    }
  )

  await step("closes from the cancel button", async () => {
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<ModalOpenByDefault />)

  await step("starts open and closes from the close button", async () => {
    const modal = await screen.findByRole("dialog", { name: "Edit profile" })
    await waitFor(() => expect(modal).toBeVisible())
    await userEvent.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("With Close Button", async () => {
  const { canvas, step } = await renderExample(<ModalWithCloseButton />)

  await step("opens and closes from the close button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Share project" }))
    const modal = await screen.findByRole("dialog", { name: "Share project" })
    await expect(
      screen.getByRole("textbox", { name: "Project link" })
    ).toHaveValue("https://esuiss.dev/p/1042")
    await userEvent.click(within(modal).getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("With Close Label", async () => {
  const { canvas, step } = await renderExample(<ModalWithCloseLabel />)

  await step("closes from the labelled close button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Share project" }))
    const modal = await screen.findByRole("dialog", { name: "Share project" })
    await expect(
      screen.getByRole("textbox", { name: "Project link" })
    ).toHaveValue("https://esuiss.dev/p/1042")
    await userEvent.click(within(modal).getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Floating", async () => {
  const { canvas, step } = await renderExample(<ModalFloating />)

  const trigger = canvas.getByRole("button", { name: "Edit profile" })

  await step("opens a named modal with its form", async () => {
    await userEvent.click(trigger)
    const modal = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(modal).toHaveAccessibleDescription(
      "Update your name and username. Click save when you are done."
    )
    await expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace")
  })

  await step(
    "closes with Escape and returns focus to the trigger",
    async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
    }
  )

  await step("closes from the cancel button", async () => {
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
