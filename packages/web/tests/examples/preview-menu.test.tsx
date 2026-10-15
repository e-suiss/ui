import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PreviewMenuCustomPreview from "@/examples/preview-menu-custom-preview"
import PreviewMenuDemo from "@/examples/preview-menu-demo"
import PreviewMenuDisabledItem from "@/examples/preview-menu-disabled-item"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<PreviewMenuDemo />)

  const photo = canvas.getByRole("img", { name: "Photo 2" })

  await step("lifts the photo into a preview with its menu", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target: photo })
    const menu = await screen.findByRole("menu")
    await expect(
      Array.from(menu.querySelectorAll("[role=menuitem]"), (item) =>
        item.textContent?.trim()
      )
    ).toEqual(["Copy", "Share", "Favorite", "Delete"])
  })

  await step("runs the chosen action and closes", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: "Share" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(canvas.getByRole("status")).toHaveTextContent("Shared Photo 2")
  })

  await step("closes with Escape without acting", async () => {
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: canvas.getByRole("img", { name: "Photo 5" }),
    })
    await screen.findByRole("menu")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(canvas.getByRole("status")).toHaveTextContent("Shared Photo 2")
  })
})
test("Disabled Item", async () => {
  const { canvas, step } = await renderExample(<PreviewMenuDisabledItem />)

  const photo = canvas.getByRole("img", { name: "Photo 1" })

  await step("keeps the disabled item from acting", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target: photo })
    const favorite = await screen.findByRole("menuitem", { name: "Favorite" })
    await expect(favorite).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(favorite, { pointerEventsCheck: 0 })
    await expect(screen.getByRole("menu")).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Touch and hold a photo, or right-click it."
    )
  })

  await step("still runs the enabled items", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target: photo })
    await userEvent.click(await screen.findByRole("menuitem", { name: "Copy" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(canvas.getByRole("status")).toHaveTextContent("Copied Photo 1")
  })
})
test("Custom Preview", async () => {
  const { canvas, step } = await renderExample(<PreviewMenuCustomPreview />)

  await step("shows the custom preview above the menu", async () => {
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: canvas.getByText("Trip to the coast"),
    })
    await screen.findByRole("menu")
    await expect(
      screen.getByText("48 photos · Updated today")
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: "Delete album" })
      ).toBeVisible()
    )
  })

  await step("closes from a menu item", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: "Share album" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
