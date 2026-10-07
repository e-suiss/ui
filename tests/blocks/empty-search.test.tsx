import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { EmptySearch } from "@/components/blocks/empty-search"

const search = () => page.getByRole("searchbox", { name: "Search suiss" })

const suggested = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("nav[aria-label=Suggested] button"),
    (item) => item.textContent
  )

const heading = () =>
  document.querySelector("[data-slot=empty-title]")?.textContent

describe("EmptySearch", () => {
  it("reports no results for the starting query and offers alternatives", async () => {
    await render(<EmptySearch />)
    await expect.element(search()).toHaveValue("book neo")
    expect(heading()).toBe("No results for “book neo”.")
    await expect
      .element(page.getByText("Check the spelling or try one of these:"))
      .toBeVisible()
    for (const name of [
      "Book Air",
      "Book Pro",
      "Book mini",
      "Compare Book models",
    ]) {
      await expect.element(page.getByRole("button", { name })).toBeVisible()
    }
    expect(suggested()).toEqual([])
  })

  it("suggests products that start with the query", async () => {
    await render(<EmptySearch />)
    await search().fill("book")
    await expect.poll(suggested).toEqual(["Book Air", "Book Pro", "Book mini"])
    expect(heading()).toBeUndefined()
    await search().fill("  BOOK M ")
    await expect.poll(suggested).toEqual(["Book mini"])
  })

  it("fills the search with a picked suggestion", async () => {
    await render(<EmptySearch />)
    await page.getByRole("button", { name: "Book Pro" }).click()
    await expect.element(search()).toHaveValue("Book Pro")
    await expect.poll(suggested).toEqual(["Book Pro"])
    await search().fill("book")
    await page
      .getByRole("navigation", { name: "Suggested" })
      .getByRole("button", { name: "Book Air" })
      .click()
    await expect.element(search()).toHaveValue("Book Air")
  })

  it("shows no results for queries outside the catalogue", async () => {
    await render(<EmptySearch />)
    await search().fill("watch")
    await expect.poll(heading).toBe("No results for “watch”.")
    await search().fill("compare")
    await expect.poll(heading).toBe("No results for “compare”.")
  })

  it("clears the query, refocuses the field and prompts for a search", async () => {
    await render(<EmptySearch />)
    await page.getByRole("button", { name: "Clear search" }).click()
    await expect.element(search()).toHaveValue("")
    await expect.element(search()).toHaveFocus()
    await expect.poll(heading).toBe("What are you looking for?")
    await expect
      .element(
        page.getByText("Search for products, support articles or stores.")
      )
      .toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Clear search" }))
      .not.toBeInTheDocument()
    await userEvent.keyboard("Book")
    await expect.poll(suggested).toEqual(["Book Air", "Book Pro", "Book mini"])
  })
})
