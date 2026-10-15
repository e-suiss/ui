import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ButtonDemo from "@/examples/button-demo"
import ButtonDisabled from "@/examples/button-disabled"
import ButtonWithIcon from "@/examples/button-with-icon"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<ButtonDemo />)

  const button = canvas.getByRole("button", { name: "Button" })
  await expect(button).toBeEnabled()
  await userEvent.tab()
  await expect(button).toHaveFocus()
})
test("With Icon", async () => {
  const { canvas } = await renderExample(<ButtonWithIcon />)

  await expect(
    canvas.getByRole("button", { name: "New project" })
  ).toBeVisible()
  await expect(canvas.getByRole("button", { name: "Add" })).toBeVisible()
})
test("Disabled", async () => {
  const { canvas } = await renderExample(<ButtonDisabled />)

  const button = canvas.getByRole("button", { name: "Button" })
  await expect(button).toBeDisabled()
  await userEvent.tab()
  await expect(button).not.toHaveFocus()
})
