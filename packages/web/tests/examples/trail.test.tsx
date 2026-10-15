import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TrailCollapsed from "@/examples/trail-collapsed"
import TrailDemo from "@/examples/trail-demo"
import TrailTwoLevels from "@/examples/trail-two-levels"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<TrailDemo />)

  const nav = canvas.getByRole("navigation", { name: "breadcrumb" })

  await step("links every ancestor to its page", async () => {
    const links = within(nav).getAllByRole("link")
    await expect(
      links.map((link) => [link.textContent, link.getAttribute("href")])
    ).toEqual([
      ["Support", "#support"],
      ["Account", "#account"],
      ["Security", "#security"],
    ])
  })

  await step("marks the last item as the current page", async () => {
    await expect(
      within(nav).getByText("Turn on two-factor authentication")
    ).toHaveAttribute("aria-current", "page")
  })

  await step("goes up to an earlier page from the trail", async () => {
    await userEvent.click(within(nav).getByRole("link", { name: "Account" }))
    await waitFor(() =>
      expect(within(nav).getByText("Account")).toHaveAttribute(
        "aria-current",
        "page"
      )
    )
    await expect(canvas.getByRole("heading", { name: "Account" })).toBeVisible()
    await expect(within(nav).queryByText("Security")).toBeNull()
  })

  await step("goes down to a child page from the content", async () => {
    await userEvent.click(canvas.getByRole("link", { name: "Profile" }))
    await waitFor(() =>
      expect(within(nav).getByText("Profile")).toHaveAttribute(
        "aria-current",
        "page"
      )
    )
    await expect(
      within(nav).getByRole("link", { name: "Account" })
    ).toHaveAttribute("href", "#account")
  })
})
test("Collapsed", async () => {
  const { canvas, step } = await renderExample(<TrailCollapsed />)

  const nav = canvas.getByRole("navigation", { name: "breadcrumb" })

  await step("keeps the root and the nearest ancestors", async () => {
    const links = within(nav).getAllByRole("link")
    await expect(links.map((link) => link.textContent)).toEqual([
      "Support",
      "Billing",
      "Invoices",
    ])
    await expect(
      within(nav).getByText("Download an invoice as PDF")
    ).toHaveAttribute("aria-current", "page")
  })

  await step("folds the middle into a labelled ellipsis", async () => {
    await expect(within(nav).getByText("More")).toBeInTheDocument()
    await expect(within(nav).queryByText("Products")).toBeNull()
    await expect(within(nav).queryByText("Workspace")).toBeNull()
  })
})
test("Two Levels", async () => {
  const { canvas } = await renderExample(<TrailTwoLevels />)

  const nav = canvas.getByRole("navigation", { name: "breadcrumb" })
  await expect(
    within(nav).getByRole("link", { name: "Security" })
  ).toHaveAttribute("href", "#security")
  await expect(within(nav).getAllByRole("link")).toHaveLength(1)
  await expect(
    within(nav).getByText("Turn on two-factor authentication")
  ).toHaveAttribute("aria-current", "page")
})
