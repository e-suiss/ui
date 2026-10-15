import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ToastDemo from "@/examples/toast-demo"
import ToastPromiseRejected from "@/examples/toast-promise-rejected"
import ToastPromiseToast from "@/examples/toast-promise-toast"
import ToastTimeout from "@/examples/toast-timeout"
import ToastTitleOnly from "@/examples/toast-title-only"
import ToastTypes from "@/examples/toast-types"
import ToastWithAction from "@/examples/toast-with-action"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ToastDemo />)

  await step("shows a titled toast with its description", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }))
    const toast = await screen.findByRole("dialog", { name: "Event created" })
    await expect(toast).toHaveAccessibleDescription(
      "Friday, October 3 at 9:00 AM"
    )
    await expect(
      screen.getByRole("region", { name: "Notifications" })
    ).toContainElement(toast)
  })

  await step("reveals and uses the close button on hover", async () => {
    await userEvent.hover(await screen.findByText("Event created"))
    await userEvent.click(
      await screen.findByRole("button", { name: "Close toast" })
    )
    await waitFor(() => expect(screen.queryByText("Event created")).toBeNull())
  })
})
test("Types", async () => {
  const { canvas, step } = await renderExample(<ToastTypes />)

  await step("stacks one toast per type", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }))
    await userEvent.click(canvas.getByRole("button", { name: "Error" }))
    await expect(await screen.findByText("Changes saved")).toBeInTheDocument()
    await expect(await screen.findByText("Upload failed")).toBeInTheDocument()
  })
})
test("Title Only", async () => {
  const { canvas, step } = await renderExample(<ToastTitleOnly />)

  await step("shows a toast named by its title alone", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Upload photos" }))
    const toast = await screen.findByRole("dialog", {
      name: "8 photos uploaded",
    })
    await expect(
      screen.getByRole("region", { name: "Notifications" })
    ).toContainElement(toast)
  })

  await step("closes from the close button", async () => {
    await userEvent.hover(await screen.findByText("8 photos uploaded"))
    await userEvent.click(
      await screen.findByRole("button", { name: "Close toast" })
    )
    await waitFor(() =>
      expect(screen.queryByText("8 photos uploaded")).toBeNull()
    )
  })
})
test("With Action", async () => {
  const { canvas, step } = await renderExample(<ToastWithAction />)

  await step("closes the toast from its action", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Archive message" })
    )
    await userEvent.click(await screen.findByRole("button", { name: "Undo" }))
    await waitFor(() =>
      expect(screen.queryByText("Message archived")).toBeNull()
    )
  })
})
test("Timeout", async () => {
  const { canvas, step } = await renderExample(<ToastTimeout />)

  await step("dismisses the short toast on its own", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Short" }))
    await expect(await screen.findByText("Link copied")).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText("Link copied")).toBeNull(), {
      timeout: 4000,
    })
  })

  await step("keeps the persistent toast until closed", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Persistent" }))
    await expect(await screen.findByText("Connection lost")).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "Close all" }))
    await waitFor(() =>
      expect(screen.queryByText("Connection lost")).toBeNull()
    )
  })
})
test("Promise Toast", async () => {
  const { canvas, step } = await renderExample(<ToastPromiseToast />)

  await step("moves from loading to success", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Publish post" }))
    await expect(await screen.findByText("Publishing post")).toBeInTheDocument()
    await expect(
      await screen.findByText("Post published", {}, { timeout: 4000 })
    ).toBeInTheDocument()
  })
})
test("Promise Rejected", async () => {
  const { canvas, step } = await renderExample(<ToastPromiseRejected />)

  await step("moves from loading to the error", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Publish post" }))
    await expect(
      await screen.findByText("Publishing failed", {}, { timeout: 4000 })
    ).toBeInTheDocument()
    await expect(screen.getByText("Network error")).toBeInTheDocument()
  })
})
