import { expect, test } from "vitest"
import BadgeAsLink from "@/examples/badge-as-link"
import BadgeDemo from "@/examples/badge-demo"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<BadgeDemo />)

  await expect(canvas.getByText("Badge")).toBeVisible()
})
test("As Link", async () => {
  const { canvas } = await renderExample(<BadgeAsLink />)

  await expect(
    canvas.getByRole("link", { name: "Documentation" })
  ).toHaveAttribute("href", "#documentation")
})
