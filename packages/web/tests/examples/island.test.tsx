import { type screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import IslandActivityWithNotifications from "@/examples/island-activity-with-notifications"
import IslandLiveActivity from "@/examples/island-live-activity"
import IslandNotification from "@/examples/island-notification"
import { renderExample } from "@/tests/render-example"

const JORDAN = /Jordan Lee/
const REVIEW = /Design review/
const DOWNLOADING = /Downloading Design-Kit\.zip/
function islandOf(canvasElement: HTMLElement) {
  const island = canvasElement.querySelector<HTMLElement>("[data-slot=island]")
  if (!island) throw new Error("Island is not rendered")
  return island
}
async function startDownload(canvas: {
  getByRole: typeof screen.getByRole
  findByRole: typeof screen.findByRole
}) {
  const start = canvas.getByRole("button", { name: "Download Design-Kit.zip" })
  await userEvent.click(start)
  await expect(
    canvas.getByRole("button", { name: "Downloading…" })
  ).toBeDisabled()
  return canvas.findByRole("button", { name: DOWNLOADING })
}

test("Notification", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <IslandNotification />
  )

  const island = islandOf(canvasElement)

  await step("stays hidden until something happens", async () => {
    await expect(island).toHaveAttribute("data-view", "hidden")
    await expect(canvas.queryByRole("button", { name: JORDAN })).toBeNull()
  })

  await step("grows to show a notification", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "New message" }))
    const notice = await canvas.findByRole("button", { name: JORDAN })
    await expect(notice).toHaveTextContent("Are we still on for Saturday?")
    await expect(island).toHaveAttribute("data-view", "notice")
  })

  await step("swaps in a newer notification", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Reminder" }))
    await expect(
      await canvas.findByRole("button", { name: REVIEW })
    ).toHaveTextContent("Starts in 10 minutes")
    await expect(canvas.queryByRole("button", { name: JORDAN })).toBeNull()
  })

  await step("shrinks back when the notification is tapped", async () => {
    await userEvent.click(canvas.getByRole("button", { name: REVIEW }))
    await waitFor(() => expect(island).toHaveAttribute("data-view", "hidden"))
    await expect(canvas.queryByRole("button", { name: REVIEW })).toBeNull()
  })
})
test("Live Activity", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <IslandLiveActivity />
  )

  const island = islandOf(canvasElement)
  let compact = canvas.getByRole("button", {
    name: "Download Design-Kit.zip",
  })

  await step("shows the activity in the compact pill", async () => {
    compact = await startDownload(canvas)
    await expect(island).toHaveAttribute("data-view", "compact")
    await expect(compact).toHaveAttribute("aria-expanded", "false")
  })

  await step(
    "expands to the details and focuses the first control",
    async () => {
      await userEvent.click(compact)
      await waitFor(() =>
        expect(island).toHaveAttribute("data-view", "expanded")
      )
      await expect(compact).toHaveAttribute("aria-expanded", "true")
      await expect(
        canvas.getByRole("progressbar", { name: "Download progress" })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Cancel download" })
        ).toHaveFocus()
      )
    }
  )

  await step(
    "collapses with Escape and returns focus to the pill",
    async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() =>
        expect(island).toHaveAttribute("data-view", "compact")
      )
      await waitFor(() => expect(compact).toHaveFocus())
    }
  )

  await step("cancels the download from the expanded view", async () => {
    await userEvent.click(compact)
    await userEvent.click(
      await canvas.findByRole("button", { name: "Cancel download" })
    )
    await waitFor(() => expect(island).toHaveAttribute("data-view", "hidden"))
    await expect(
      canvas.getByRole("button", { name: "Download Design-Kit.zip" })
    ).toBeEnabled()
  })
})
test("Activity With Notifications", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <IslandActivityWithNotifications />
  )

  const island = islandOf(canvasElement)

  await step("starts a live activity", async () => {
    await startDownload(canvas)
    await expect(island).toHaveAttribute("data-view", "compact")
  })

  await step("lets a notification take over the pill", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "New message" }))
    await canvas.findByRole("button", { name: JORDAN })
    await expect(island).toHaveAttribute("data-view", "notice")
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: DOWNLOADING })).toBeNull()
    )
  })

  await step(
    "returns to the activity once the notification is gone",
    async () => {
      await userEvent.click(canvas.getByRole("button", { name: JORDAN }))
      await waitFor(() =>
        expect(island).toHaveAttribute("data-view", "compact")
      )
      await expect(
        canvas.getByRole("button", { name: DOWNLOADING })
      ).toBeInTheDocument()
    }
  )
})
