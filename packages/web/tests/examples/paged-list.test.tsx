import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PagedListControlled from "@/examples/paged-list-controlled"
import PagedListCustomLabels from "@/examples/paged-list-custom-labels"
import PagedListDemo from "@/examples/paged-list-demo"
import PagedListPageLinks from "@/examples/paged-list-page-links"
import PagedListSinglePage from "@/examples/paged-list-single-page"
import PagedListStartOnLaterPage from "@/examples/paged-list-start-on-later-page"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<PagedListDemo />)

  await step("shows the first page of items", async () => {
    await expect(canvas.getByText("Getting started · thread 1")).toBeVisible()
    await expect(canvas.queryByText("Dark mode tokens · thread 34")).toBeNull()
    await expect(
      canvas.getByRole("link", { name: "Go to previous page" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("moves to a page from its number", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "2" }))
    await expect(
      await canvas.findByText("Release notes · thread 12")
    ).toBeVisible()
    await expect(canvas.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.queryByText("Getting started · thread 1")).toBeNull()
  })

  await step("steps forward and back with next and previous", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "Go to next page" }))
    await expect(
      await canvas.findByText("Getting started · thread 25")
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole("link", { name: "Go to previous page" })
    )
    await expect(
      await canvas.findByText("Release notes · thread 12")
    ).toBeVisible()
  })

  await step("disables next on the last page", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "6" }))
    await expect(
      await canvas.findByText("Getting started · thread 57")
    ).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("aria-disabled", "true")
  })
})
test("Start On Later Page", async () => {
  const { canvas, step } = await renderExample(<PagedListStartOnLaterPage />)

  await step("opens on the given page", async () => {
    await expect(canvas.getByRole("link", { name: "4" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.getByText("Release notes · thread 36")).toBeVisible()
    await expect(canvas.queryByText("Getting started · thread 1")).toBeNull()
  })
})
test("Single Page", async () => {
  const { canvas, step } = await renderExample(<PagedListSinglePage />)

  await step("lists every item without pagination", async () => {
    await expect(canvas.getByText("Theming · thread 6")).toBeVisible()
    await expect(canvas.queryByRole("navigation")).toBeNull()
  })
})
test("Page Links", async () => {
  const { canvas, step } = await renderExample(<PagedListPageLinks />)

  await step("renders real page links", async () => {
    const second = canvas.getByRole("link", { name: "2" })
    await expect(second).toHaveAttribute("href", "#page-2")
    await expect(
      canvas.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("href", "#page-2")
    await expect(
      canvas.getByRole("link", { name: "Go to previous page" })
    ).toHaveAttribute("href", "#page-0")
  })
})
test("Custom Labels", async () => {
  const { canvas, step } = await renderExample(<PagedListCustomLabels />)

  await step("shows the custom labels and pages with them", async () => {
    await expect(canvas.getByText("Newer")).toBeVisible()
    await userEvent.click(canvas.getByText("Older"))
    await expect(
      await canvas.findByText("Release notes · thread 12")
    ).toBeVisible()
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<PagedListControlled />)

  await step("starts on the controlled page", async () => {
    await expect(canvas.getByText("Page 2")).toBeVisible()
    await expect(canvas.getByText("Release notes · thread 12")).toBeVisible()
  })

  await step("reports page changes to the owner", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "3" }))
    await waitFor(() => expect(canvas.getByText("Page 3")).toBeVisible())
    await expect(canvas.getByText("Getting started · thread 25")).toBeVisible()
  })
})
