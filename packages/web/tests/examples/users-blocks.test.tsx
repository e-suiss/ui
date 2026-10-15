import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { UsersDetail } from "@/components/blocks/users-detail"
import { UsersInvite } from "@/components/blocks/users-invite"
import { UsersTable } from "@/components/blocks/users-table"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

const REMOVE_CHIP = /^Remove /

test("List", async () => {
  const { canvas, canvasElement, step } = await renderExample(<UsersTable />)

  const rows = () => canvasElement.querySelectorAll("tbody tr")

  await step("a role filter narrows the people", async () => {
    await expect(rows()).toHaveLength(6)
    const roles = canvas.getByRole(SINGLE.group, { name: "Role" })
    await userEvent.click(
      within(roles).getByRole(SINGLE.role, { name: "Editor" })
    )
    await waitFor(() => expect(rows()).toHaveLength(2))
    await userEvent.click(within(roles).getByRole(SINGLE.role, { name: "All" }))
    await waitFor(() => expect(rows()).toHaveLength(6))
  })

  await step("selecting a row shows the bulk actions", async () => {
    await expect(canvas.queryByRole("button", { name: "Suspend" })).toBeNull()
    const box = canvas.getByRole("checkbox", { name: "Select Riley Chen" })
    await userEvent.click(box)
    await expect(box).toBeChecked()
    await expect(canvas.getByText("1 selected")).toBeInTheDocument()
    await expect(
      await canvas.findByRole("button", { name: "Suspend" })
    ).toBeVisible()
  })
})
test("Detail", async () => {
  const { canvas, step } = await renderExample(<UsersDetail />)

  await step("picking a person opens their profile", async () => {
    const users = canvas.getByRole("region", { name: "Users" })
    const person = within(users)
      .getAllByRole("button")
      .find((button) => button.textContent?.includes("Taylor Kim"))
    if (!person) throw new Error("Missing Taylor Kim")
    await userEvent.click(person)
    await expect(person).toHaveAttribute("aria-current", "true")
    const detail = await canvas.findByRole("region", { name: "Taylor Kim" })
    await expect(
      within(detail).getByText("taylor@company.com · Viewer")
    ).toBeInTheDocument()
  })
})
test("Invite", async () => {
  const { canvas, step } = await renderExample(<UsersInvite />)

  await step("typing an email adds an invitee", async () => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "morgan@company.com{Enter}"
    )
    await expect(
      await canvas.findByText("2 people will be invited as Editor.")
    ).toBeInTheDocument()
    await expect(
      canvas.getAllByRole("button", { name: REMOVE_CHIP })
    ).toHaveLength(2)
  })

  await step("sending lists them as pending", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Send Invites" }))
    await expect(
      await screen.findByText("2 invitations sent")
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Send Invites" })
    ).toBeDisabled()
  })
})
