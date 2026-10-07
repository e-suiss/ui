import type * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { PagedList } from "@/components/patterns/paged-list"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => `Row ${index + 1}`)

function List({
  count,
  ...props
}: { count: number } & Omit<
  React.ComponentProps<typeof PagedList<string>>,
  "items" | "renderItem"
>) {
  return (
    <PagedList
      items={makeItems(count)}
      pageSize={10}
      renderItem={(item) => <span>{item}</span>}
      {...props}
    />
  )
}

function sequence() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=pagination-content] > li"
    )
  )
    .slice(1, -1)
    .map((item) =>
      item.querySelector("[data-slot=pagination-ellipsis]")
        ? "…"
        : (item.textContent ?? "")
    )
}

function rows() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=paged-list-item]"),
    (item) => item.textContent
  )
}

const control = (name: string) => page.getByRole("link", { name, exact: true })
const previous = () => control("Go to previous page")
const next = () => control("Go to next page")

describe("PagedList", () => {
  it("shows the first page of items", async () => {
    await render(<List count={57} />)
    await expect.poll(rows).toHaveLength(10)
    expect(rows()[0]).toBe("Row 1")
    expect(rows()[9]).toBe("Row 10")
  })

  it("lists every page without ellipsis when there are three pages", async () => {
    await render(<List count={25} />)
    await expect.poll(sequence).toEqual(["1", "2", "3"])
  })

  it("collapses the tail behind an ellipsis on the first page", async () => {
    await render(<List count={100} />)
    await expect.poll(sequence).toEqual(["1", "2", "…", "10"])
  })

  it("collapses the head behind an ellipsis on the last page", async () => {
    await render(<List count={100} defaultPage={10} />)
    await expect.poll(sequence).toEqual(["1", "…", "9", "10"])
  })

  it("puts ellipses on both sides of a middle page", async () => {
    await render(<List count={100} defaultPage={5} />)
    await expect.poll(sequence).toEqual(["1", "…", "4", "5", "6", "…", "10"])
  })

  it("drops the ellipsis when the neighbours touch the edges", async () => {
    await render(<List count={100} defaultPage={3} />)
    await expect.poll(sequence).toEqual(["1", "2", "3", "4", "…", "10"])
  })

  it("keeps a single ellipsis for a small page count", async () => {
    await render(<List count={50} defaultPage={2} />)
    await expect.poll(sequence).toEqual(["1", "2", "3", "…", "5"])
  })

  it("hides pagination when everything fits on one page", async () => {
    await render(<List count={6} />)
    await expect.poll(rows).toHaveLength(6)
    await expect
      .element(page.getByRole("navigation", { name: "pagination" }))
      .not.toBeInTheDocument()
  })

  it("marks the current page and clamps an out of range default page", async () => {
    await render(<List count={57} defaultPage={99} />)
    await expect.element(control("6")).toHaveAttribute("aria-current", "page")
    await expect
      .poll(rows)
      .toEqual([
        "Row 51",
        "Row 52",
        "Row 53",
        "Row 54",
        "Row 55",
        "Row 56",
        "Row 57",
      ])
  })

  it("disables previous on the first page and next on the last page", async () => {
    await render(<List count={30} />)
    await expect.element(previous()).toHaveAttribute("aria-disabled", "true")
    await expect.element(next()).not.toHaveAttribute("aria-disabled")
    await control("3").click()
    await expect.element(next()).toHaveAttribute("aria-disabled", "true")
    await expect.element(previous()).not.toHaveAttribute("aria-disabled")
  })

  it("moves with next, previous and page links", async () => {
    const onPageChange = vi.fn()
    await render(<List count={100} onPageChange={onPageChange} />)
    await next().click()
    await expect.element(control("2")).toHaveAttribute("aria-current", "page")
    expect(rows()[0]).toBe("Row 11")
    expect(onPageChange).toHaveBeenLastCalledWith(2)
    await expect.poll(sequence).toEqual(["1", "2", "3", "…", "10"])

    await control("10").click()
    await expect.element(control("10")).toHaveAttribute("aria-current", "page")
    expect(rows()[0]).toBe("Row 91")
    expect(onPageChange).toHaveBeenLastCalledWith(10)

    await previous().click()
    await expect.element(control("9")).toHaveAttribute("aria-current", "page")
    expect(rows()[0]).toBe("Row 81")
    expect(onPageChange).toHaveBeenLastCalledWith(9)
    await expect.poll(sequence).toEqual(["1", "…", "8", "9", "10"])
  })

  it("does not report a change when the current page is clicked", async () => {
    const onPageChange = vi.fn()
    await render(<List count={30} onPageChange={onPageChange} />)
    await control("1").click()
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it("follows a controlled page and only reports the request", async () => {
    const onPageChange = vi.fn()
    const screen = await render(
      <List count={100} page={4} onPageChange={onPageChange} />
    )
    await expect.element(control("4")).toHaveAttribute("aria-current", "page")
    await next().click()
    expect(onPageChange).toHaveBeenLastCalledWith(5)
    await expect.element(control("4")).toHaveAttribute("aria-current", "page")
    await screen.rerender(
      <List count={100} page={5} onPageChange={onPageChange} />
    )
    await expect.element(control("5")).toHaveAttribute("aria-current", "page")
    expect(rows()[0]).toBe("Row 41")
  })

  it("uses real hrefs and custom labels when given", async () => {
    await render(
      <List
        count={30}
        getPageHref={(target) => `#page-${target}`}
        previousLabel="Newer"
        nextLabel="Older"
      />
    )
    await expect.element(control("2")).toHaveAttribute("href", "#page-2")
    await expect.element(next()).toHaveAttribute("href", "#page-2")
    await expect.element(next()).toHaveTextContent("Older")
    await expect.element(previous()).toHaveTextContent("Newer")
  })

  it("loads more items instead of paginating on mobile", async () => {
    await page.viewport(390, 844)
    await render(<List count={25} />)
    await expect
      .element(page.getByRole("button", { name: "Load more" }))
      .toBeVisible()
    expect(rows()).toHaveLength(10)
    await expect
      .element(page.getByRole("navigation", { name: "pagination" }))
      .not.toBeInTheDocument()
    await page.getByRole("button", { name: "Load more" }).click()
    await expect.poll(rows).toHaveLength(20)
    await page.getByRole("button", { name: "Load more" }).click()
    await expect.poll(rows).toHaveLength(25)
    await expect
      .element(page.getByRole("button", { name: "Load more" }))
      .not.toBeInTheDocument()
  })
})
