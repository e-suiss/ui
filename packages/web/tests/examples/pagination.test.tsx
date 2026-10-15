import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PaginationCompact from "@/examples/pagination-compact"
import PaginationCustomLabels from "@/examples/pagination-custom-labels"
import PaginationDemo from "@/examples/pagination-demo"
import PaginationRowsPerPage from "@/examples/pagination-rows-per-page"
import PaginationWithEllipsis from "@/examples/pagination-with-ellipsis"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const ROWS_PER_PAGE = /Rows per page$/

test("Default", async () => {
  const { canvas, step } = await renderExample(<PaginationDemo />)

  const nav = canvas.getByRole("navigation", { name: "pagination" })

  await step("marks the current page", async () => {
    await expect(within(nav).getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.getByText("#1095")).toBeVisible()
  })

  await step("moves forward with the next link", async () => {
    await userEvent.click(
      within(nav).getByRole("link", { name: "Go to next page" })
    )
    await expect(within(nav).getByRole("link", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.getByText("#1090")).toBeVisible()
  })

  await step("disables previous on the first page", async () => {
    await userEvent.click(within(nav).getByRole("link", { name: "1" }))
    await expect(
      within(nav).getByRole("link", { name: "Go to previous page" })
    ).toHaveAttribute("aria-disabled", "true")
    await expect(canvas.getByText("#1100")).toBeVisible()
  })
})
test("Compact", async () => {
  const { canvas, step } = await renderExample(<PaginationCompact />)

  const input = canvas.getByRole("textbox", { name: "Page" })

  await step("jumps to a typed page on Enter", async () => {
    await userEvent.clear(input)
    await userEvent.type(input, "5{Enter}")
    await expect(canvas.getByText("#1080")).toBeVisible()
  })

  await step("clamps an out-of-range page", async () => {
    await userEvent.clear(input)
    await userEvent.type(input, "99{Enter}")
    await expect(input).toHaveValue("13")
    await expect(
      canvas.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("syncs the input with the arrows", async () => {
    await userEvent.click(
      canvas.getByRole("link", { name: "Go to previous page" })
    )
    await expect(input).toHaveValue("12")
  })
})
test("Rows Per Page", async () => {
  const { canvas, step } = await renderExample(<PaginationRowsPerPage />)

  await step("changes the page size from the select", async () => {
    await userEvent.click(
      canvas.getByRole(
        byBase({ base: "combobox", radix: "combobox", aria: "button" }),
        {
          name: byBase<string | RegExp>({
            base: "Rows per page",
            radix: "Rows per page",
            aria: ROWS_PER_PAGE,
          }),
        }
      )
    )
    await userEvent.click(
      await screen.findByRole("option", { name: "10 rows" })
    )
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(11))
  })

  await step("jumps to the last and first pages", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "Go to last page" }))
    await expect(canvas.getAllByRole("row")).toHaveLength(3)
    await expect(
      canvas.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(
      canvas.getByRole("link", { name: "Go to first page" })
    )
    await expect(canvas.getByText("#1100")).toBeVisible()
  })
})
test("With Ellipsis", async () => {
  const { canvas, step } = await renderExample(<PaginationWithEllipsis />)

  await step("hides the ellipses and marks page 10", async () => {
    await expect(canvas.getByRole("link", { name: "10" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.getAllByRole("link")).toHaveLength(7)
  })
})
test("Custom Labels", async () => {
  const { canvas, step } = await renderExample(<PaginationCustomLabels />)

  await step("names the links after their custom text", async () => {
    await expect(canvas.getByRole("link", { name: "Newer" })).toHaveTextContent(
      "Newer"
    )
    await expect(canvas.getByRole("link", { name: "Older" })).toHaveTextContent(
      "Older"
    )
  })
})
