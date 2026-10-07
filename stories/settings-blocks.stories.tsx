import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { SettingsAccount } from "@/components/blocks/settings-account"
import { SettingsDevice } from "@/components/blocks/settings-device"
import { SettingsNotifications } from "@/components/blocks/settings-notifications"

const meta = {
  title: "Blocks/Settings",
  component: SettingsDevice,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsDevice>

export default meta

type Story = StoryObj<typeof meta>

const PREVIEW = /^Lock screen preview/
const WIFI_ROW = /^Wi-Fi/
const BLUETOOTH_ROW = /^Bluetooth/

export const Device: Story = {
  play: async ({ canvas, step }) => {
    const wifi = canvas.getByRole("link", { name: WIFI_ROW })

    await step("airplane mode turns the radios off", async () => {
      await expect(wifi).toHaveTextContent("Home")
      const airplane = canvas.getByRole("switch", { name: "Airplane Mode" })
      await userEvent.click(airplane)
      await expect(airplane).toHaveAttribute("aria-checked", "true")
      await waitFor(() => expect(wifi).toHaveTextContent("Off"))
      await expect(
        canvas.getByRole("link", { name: BLUETOOTH_ROW })
      ).toHaveTextContent("Off")
    })
  },
}

export const Account: Story = {
  render: () => <SettingsAccount />,
  play: async ({ canvas, step }) => {
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
  },
}

export const Notifications: Story = {
  render: () => <SettingsNotifications />,
  play: async ({ canvas, step }) => {
    const preview = canvas.getByRole("img", { name: PREVIEW })

    await step("a persistent banner updates the preview", async () => {
      const style = canvas.getByRole("group", { name: "Banner style" })
      const persistent = within(style).getByRole("button", {
        name: "Persistent",
      })
      await userEvent.click(persistent)
      await expect(persistent).toHaveAttribute("aria-pressed", "true")
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
  },
}
