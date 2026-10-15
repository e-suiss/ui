import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import NativeSelectDemo from "@/examples/native-select-demo"
import NativeSelectDisabled from "@/examples/native-select-disabled"
import NativeSelectInvalid from "@/examples/native-select-invalid"
import NativeSelectWithGroups from "@/examples/native-select-with-groups"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<NativeSelectDemo />)

  const select = canvas.getByRole("combobox", { name: "Fruit" })

  await step("starts on the disabled placeholder", async () => {
    await expect(select).toHaveValue("")
    await expect(
      canvas.getByRole("option", { name: "Select a fruit" })
    ).toBeDisabled()
  })

  await step("selects an option", async () => {
    await userEvent.selectOptions(select, "banana")
    await expect(select).toHaveValue("banana")
    await expect(
      canvas.getByRole<HTMLOptionElement>("option", { name: "Banana" }).selected
    ).toBe(true)
  })
})
test("With Groups", async () => {
  const { canvas, step } = await renderExample(<NativeSelectWithGroups />)

  await step("groups options and selects across groups", async () => {
    await expect(canvas.getByRole("group", { name: "Asia" })).toBeTruthy()
    const select = canvas.getByRole("combobox", { name: "City" })
    await userEvent.selectOptions(select, "seoul")
    await expect(select).toHaveValue("seoul")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<NativeSelectDisabled />)

  await step("disables the select", async () => {
    await expect(canvas.getByRole("combobox", { name: "Fruit" })).toBeDisabled()
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<NativeSelectInvalid />)

  await step("flags the select as invalid", async () => {
    await expect(canvas.getByRole("combobox", { name: "Fruit" })).toBeInvalid()
  })
})
