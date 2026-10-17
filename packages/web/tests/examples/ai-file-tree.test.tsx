import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import FileTreeDemo from "@/examples/file-tree-demo"
import { renderExample } from "@/tests/render-example"

const APP = /^app$/

test("Default", async () => {
  const { canvas, step } = await renderExample(<FileTreeDemo />)

  await step("marks the selected file", async () => {
    await expect(
      canvas.getByRole("button", { name: "button.tsx" })
    ).toHaveAttribute("aria-current", "true")
  })

  await step("selects another file", async () => {
    const page = canvas.getByRole("button", { name: "page.tsx" })
    await userEvent.click(page)
    await expect(page).toHaveAttribute("aria-current", "true")
    await expect(
      canvas.getByRole("button", { name: "button.tsx" })
    ).not.toHaveAttribute("aria-current")
  })

  await step("collapses a folder", async () => {
    const folder = canvas.getByRole("button", { name: APP })
    await expect(folder).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(folder)
    await expect(folder).toHaveAttribute("aria-expanded", "false")
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: "layout.tsx" })).toBeNull()
    )
  })
})
