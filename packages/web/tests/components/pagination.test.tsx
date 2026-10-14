import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationGroup,
  PaginationInput,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@/components/ui/pagination"

const control = (name: string) => page.getByRole("link", { name, exact: true })

function Basic({ current = 2 }: { current?: number }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={current === 1 || undefined}
          />
        </PaginationItem>
        {[1, 2, 3].map((entry) => (
          <PaginationItem key={entry}>
            <PaginationLink href="#" isActive={entry === current}>
              {entry}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" aria-disabled={current === 3 || undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe("Pagination", () => {
  it("announces page controls as links, not buttons", async () => {
    await render(<Basic />)
    const links = document.querySelectorAll("[data-slot=pagination-link]")
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.tagName).toBe("A")
      expect(link.hasAttribute("role")).toBe(false)
    }
    expect(page.getByRole("button").elements()).toHaveLength(0)
  })

  it("is a navigation landmark labelled pagination", async () => {
    await render(<Basic />)
    await expect
      .element(page.getByRole("navigation", { name: "pagination" }))
      .toBeVisible()
  })

  it("marks only the active link with aria-current page", async () => {
    await render(<Basic current={2} />)
    await expect.element(control("2")).toHaveAttribute("aria-current", "page")
    await expect.element(control("2")).toHaveAttribute("data-active")
    await expect.element(control("1")).not.toHaveAttribute("aria-current")
    await expect.element(control("3")).not.toHaveAttribute("aria-current")
  })

  it("renders page controls as anchors that keep their href", async () => {
    await render(<Basic />)
    const first = control("1").element()
    expect(first.tagName).toBe("A")
    expect(first.getAttribute("href")).toBe("#")
    expect(first.getAttribute("data-slot")).toBe("pagination-link")
  })

  it("names previous and next links even when their text is visible", async () => {
    await render(<Basic />)
    await expect.element(control("Go to previous page")).toBeVisible()
    await expect.element(control("Go to next page")).toBeVisible()
    await expect
      .element(control("Go to previous page"))
      .toHaveTextContent("Previous")
    await expect.element(control("Go to next page")).toHaveTextContent("Next")
  })

  it("keeps an accessible name on icon-only previous and next", async () => {
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    await expect.element(control("Go to previous page")).toBeVisible()
    await expect.element(control("Go to next page")).toBeVisible()
    await expect.element(control("Go to previous page")).toHaveTextContent("")
    const previous = control("Go to previous page").element()
    expect(previous.getBoundingClientRect().width).toBe(
      previous.getBoundingClientRect().height
    )
  })

  it("disables pointer interaction on aria-disabled links", async () => {
    const onClick = vi.fn()
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-disabled onClick={onClick} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={onClick} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const previous = control("Go to previous page")
    await expect.element(previous).toHaveAttribute("aria-disabled", "true")
    expect(getComputedStyle(previous.element()).pointerEvents).toBe("none")
    expect(
      getComputedStyle(control("Go to next page").element()).pointerEvents
    ).not.toBe("none")
    await control("Go to next page").click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("hides the ellipsis icon but announces more pages to assistive tech", async () => {
    await render(<Basic />)
    const ellipsis = document.querySelector<HTMLElement>(
      "[data-slot=pagination-ellipsis]"
    )
    expect(ellipsis?.getAttribute("aria-hidden")).toBe("true")
    expect(ellipsis?.textContent).toBe("More pages")
  })

  it("renders first, last, summary, group and input reachable by role", async () => {
    const onFirst = vi.fn()
    const onLast = vi.fn()
    await render(
      <Pagination>
        <label htmlFor="page-input">Page</label>
        <PaginationInput id="page-input" defaultValue="3" />
        <PaginationSummary>21–30 / 62</PaginationSummary>
        <PaginationGroup aria-label="Page navigation">
          <PaginationFirst href="#" onClick={onFirst} />
          <PaginationPrevious href="#" text="" />
          <PaginationNext href="#" text="" />
          <PaginationLast href="#" onClick={onLast} />
        </PaginationGroup>
      </Pagination>
    )
    const group = page.getByRole("group", { name: "Page navigation" })
    await expect.element(group).toBeVisible()
    await expect
      .element(group.getByRole("link", { name: "Go to first page" }))
      .toBeVisible()
    await expect
      .element(group.getByRole("link", { name: "Go to last page" }))
      .toBeVisible()
    expect(group.getByRole("link").elements()).toHaveLength(4)
    await expect.element(page.getByText("21–30 / 62")).toBeVisible()

    const input = page.getByRole("textbox", { name: "Page" })
    await expect.element(input).toHaveValue("3")
    await expect.element(input).toHaveAttribute("inputmode", "numeric")
    await input.fill("5")
    await expect.element(input).toHaveValue("5")

    await control("Go to first page").click()
    await control("Go to last page").click()
    expect(onFirst).toHaveBeenCalledTimes(1)
    expect(onLast).toHaveBeenCalledTimes(1)
  })

  it("reaches every link with the keyboard in order", async () => {
    await render(<Basic current={2} />)
    control("Go to previous page").element().focus()
    await userEvent.tab()
    await expect.element(control("1")).toHaveFocus()
    await userEvent.tab()
    await expect.element(control("2")).toHaveFocus()
    await userEvent.tab()
    await expect.element(control("3")).toHaveFocus()
    await userEvent.tab()
    await expect.element(control("Go to next page")).toHaveFocus()
  })
})
