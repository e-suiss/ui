import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { SettingsAccount } from "@/components/blocks/settings-account"
import { SettingsDevice } from "@/components/blocks/settings-device"
import { SettingsNotifications } from "@/components/blocks/settings-notifications"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
  aria: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const PREVIEW = /^Lock screen preview/
const WIFI_ROW = /^Wi-Fi/
const BLUETOOTH_ROW = /^Bluetooth/

test("Device", async () => {
  const { canvas, step } = await renderExample(<SettingsDevice />)

  const wifi = canvas.getByRole("link", { name: WIFI_ROW })

  await step("airplane mode turns the radios off", async () => {
    await expect(wifi).toHaveTextContent("Home")
    const airplane = canvas.getByRole("switch", { name: "Airplane Mode" })
    await userEvent.click(airplane)
    await expect(airplane).toBeChecked()
    await waitFor(() => expect(wifi).toHaveTextContent("Off"))
    await expect(
      canvas.getByRole("link", { name: BLUETOOTH_ROW })
    ).toHaveTextContent("Off")
  })
})
test("Account", async () => {
  const { canvas, step } = await renderExample(<SettingsAccount />)

  await step("editing a value and saving confirms it", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Edit email & phone" })
    )
    const input = canvas.getByRole("textbox", { name: "Email & phone" })
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.clear(input)
    await userEvent.type(input, "jamie@rivera.dev")
    const form = input.closest("form")
    if (!form) throw new Error("Missing edit form")
    await userEvent.click(within(form).getByRole("button", { name: "Save" }))
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Email & phone saved."
    )
    await expect(canvas.getByText("jamie@rivera.dev")).toBeVisible()
  })
})
test("Notifications", async () => {
  const { canvas, step } = await renderExample(<SettingsNotifications />)

  const preview = canvas.getByRole("img", { name: PREVIEW })

  await step("a persistent banner updates the preview", async () => {
    const style = canvas.getByRole(SINGLE.group, { name: "Banner style" })
    const persistent = within(style).getByRole(SINGLE.role, {
      name: "Persistent",
    })
    await userEvent.click(persistent)
    await expect(persistent).toHaveAttribute(SINGLE.pressed, "true")
    await waitFor(() =>
      expect(preview).toHaveAccessibleName(
        "Lock screen preview. Banner stays until dismissed."
      )
    )
  })

  await step("an alert location can be turned off", async () => {
    const center = canvas.getByRole("button", { name: "Notification Center" })
    await expect(center).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(center)
    await expect(center).toHaveAttribute("aria-pressed", "false")
  })
})
