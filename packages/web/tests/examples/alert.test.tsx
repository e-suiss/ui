import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import AlertDemo from "@/examples/alert-demo"
import AlertDestructive from "@/examples/alert-destructive"
import AlertWithAction from "@/examples/alert-with-action"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<AlertDemo />)

  const alert = canvas.getByRole("alert")
  await expect(alert).toHaveTextContent("Update available")
  await expect(alert).toHaveTextContent(
    "A new version is ready to install. Restart the app to apply it."
  )
})
test("Destructive", async () => {
  const { canvas } = await renderExample(<AlertDestructive />)

  await expect(canvas.getByRole("alert")).toHaveTextContent("Payment failed")
})
test("With Action", async () => {
  const { canvas } = await renderExample(<AlertWithAction />)

  const upgrade = canvas.getByRole("button", { name: "Upgrade" })
  await expect(canvas.getByRole("alert")).toContainElement(upgrade)
  await userEvent.tab()
  await expect(upgrade).toHaveFocus()
})
