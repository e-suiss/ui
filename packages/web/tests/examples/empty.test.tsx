import { expect, test } from "vitest"
import EmptyDemo from "@/examples/empty-demo"
import EmptyWithSearch from "@/examples/empty-with-search"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<EmptyDemo />)

  await expect(canvas.getByText("No projects yet")).toBeVisible()
  await expect(
    canvas.getByRole("button", { name: "Create project" })
  ).toBeVisible()
  await expect(
    canvas.getByRole("button", { name: "Import project" })
  ).toBeVisible()
})
test("With Search", async () => {
  const { canvas } = await renderExample(<EmptyWithSearch />)

  await expect(canvas.getByText("404 - Not found")).toBeVisible()
  await expect(canvas.getByPlaceholderText("Search pages...")).toBeEnabled()
  await expect(
    canvas.getByRole("link", { name: "Contact support" })
  ).toHaveAttribute("href", "#support")
})
