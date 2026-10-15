import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import BreadcrumbCustomSeparator from "@/examples/breadcrumb-custom-separator"
import BreadcrumbDemo from "@/examples/breadcrumb-demo"
import BreadcrumbWithEllipsis from "@/examples/breadcrumb-with-ellipsis"
import BreadcrumbWithHomeIcon from "@/examples/breadcrumb-with-home-icon"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<BreadcrumbDemo />)

  await step("labels the trail and marks the current page", async () => {
    const nav = canvas.getByRole("navigation", { name: "breadcrumb" })
    await expect(nav).toBeVisible()
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3)
    await expect(canvas.getByText("Website redesign")).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  await step("tabs through the links only", async () => {
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Projects" })).toHaveFocus()
  })
})
test("With Home Icon", async () => {
  const { canvas } = await renderExample(<BreadcrumbWithHomeIcon />)

  await expect(canvas.getByRole("link", { name: "Home" })).toBeVisible()
})
test("With Ellipsis", async () => {
  const { canvas, step } = await renderExample(<BreadcrumbWithEllipsis />)

  await step(
    "names the collapsed items and marks the current page",
    async () => {
      await expect(canvas.getByText("More")).toBeInTheDocument()
      await expect(canvas.getByText("Notifications")).toHaveAttribute(
        "aria-current",
        "page"
      )
    }
  )

  await step("skips the static ellipsis when tabbing", async () => {
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Settings" })).toHaveFocus()
  })
})
test("Custom Separator", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <BreadcrumbCustomSeparator />
  )

  await step("hides the custom separators from assistive tech", async () => {
    const separators = canvasElement.querySelectorAll(
      '[data-slot="breadcrumb-separator"]'
    )
    await expect(separators).toHaveLength(2)
    for (const separator of separators) {
      await expect(separator).toHaveAttribute("aria-hidden", "true")
      await expect(separator).toHaveTextContent("/")
    }
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3)
  })

  await step("tabs through the links", async () => {
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Docs" })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole("link", { name: "Components" })).toHaveFocus()
    await expect(canvas.getByText("Breadcrumb")).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
