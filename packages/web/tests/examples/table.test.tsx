import { expect, test } from "vitest"
import TableDemo from "@/examples/table-demo"
import TableSelectedRow from "@/examples/table-selected-row"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<TableDemo />)

  await step("names the table with its caption", async () => {
    await expect(
      canvas.getByRole("table", { name: "A list of your recent invoices." })
    ).toBeVisible()
  })

  await step("renders headers, rows and the footer total", async () => {
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(4)
    await expect(canvas.getAllByRole("row")).toHaveLength(7)
    await expect(canvas.getAllByRole("row").at(-1)).toHaveTextContent(
      "Total$1,750.00"
    )
  })
})
test("Selected Row", async () => {
  const { canvas, step } = await renderExample(<TableSelectedRow />)

  await step("marks only the second row as selected", async () => {
    const rows = canvas.getAllByRole("row").slice(1)
    await expect(rows[1]).toHaveAttribute("data-selected", "true")
    await expect(rows[0]).toHaveAttribute("data-selected", "false")
  })
})
