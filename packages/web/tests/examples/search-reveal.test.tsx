import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SearchRevealDemo from "@/examples/search-reveal-demo"
import SearchRevealShortList from "@/examples/search-reveal-short-list"
import { renderExample } from "@/tests/render-example"

function revealRoot(field: HTMLElement) {
  const root = field.closest<HTMLElement>("[data-slot=search-reveal]")
  if (!root) throw new Error("search reveal root not found")
  return root
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<SearchRevealDemo />)

  const field = canvas.getByRole("searchbox", { name: "Search" })
  const root = revealRoot(field)

  await step("starts with the field tucked above the list", async () => {
    await expect(root.scrollTop).toBeGreaterThan(0)
    await expect(canvas.getByText("12 notes")).toBeVisible()
  })

  await step("reveals the field when it is focused", async () => {
    await userEvent.click(field)
    await expect(field).toHaveFocus()
    await waitFor(() => expect(root.scrollTop).toBe(0))
  })

  await step("filters the notes as the user types", async () => {
    await userEvent.type(field, "porto")
    await expect(canvas.getByText("1 note")).toBeVisible()
    await expect(canvas.getByText("Trip ideas")).toBeVisible()
    await expect(canvas.queryByText("Groceries")).toBeNull()
  })

  await step("shows the empty state for a query without matches", async () => {
    await userEvent.type(field, "xyz")
    await expect(canvas.getByText("No results for “portoxyz”")).toBeVisible()
    await expect(canvas.getByText("0 notes")).toBeVisible()
  })

  await step("clears the query and keeps focus in the field", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }))
    await expect(field).toHaveValue("")
    await expect(field).toHaveFocus()
    await expect(canvas.getByText("12 notes")).toBeVisible()
  })
})
test("Short List", async () => {
  const { canvas, step } = await renderExample(<SearchRevealShortList />)

  const field = canvas.getByRole("searchbox", { name: "Search" })
  const root = revealRoot(field)

  await step("hides the field even when the list is short", async () => {
    await expect(root.scrollTop).toBeGreaterThan(0)
  })

  await step("reveals the field and filters the short list", async () => {
    await userEvent.click(field)
    await waitFor(() => expect(root.scrollTop).toBe(0))
    await userEvent.type(field, "book")
    await expect(canvas.getByText("1 note")).toBeVisible()
    await expect(canvas.getByText("Book list")).toBeVisible()
  })
})
