import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import InputOtpAlphanumeric from "@/examples/input-otp-alphanumeric"
import InputOtpDemo from "@/examples/input-otp-demo"
import InputOtpDisabled from "@/examples/input-otp-disabled"
import InputOtpFilled from "@/examples/input-otp-filled"
import InputOtpFourDigits from "@/examples/input-otp-four-digits"
import InputOtpInvalid from "@/examples/input-otp-invalid"
import InputOtpSingleGroup from "@/examples/input-otp-single-group"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<InputOtpDemo />)

  const input = canvas.getByRole<HTMLInputElement>("textbox", {
    name: "Verification code",
  })
  const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')

  await step("fills one slot per typed digit", async () => {
    await userEvent.click(input)
    await userEvent.keyboard("4829")
    await expect(input).toHaveValue("4829")
    await expect(slots[0]).toHaveTextContent("4")
    await expect(slots[3]).toHaveTextContent("9")
    await waitFor(() => expect(slots[4]).toHaveAttribute("data-active", "true"))
  })

  await step("stops at the maximum length", async () => {
    await userEvent.keyboard("13")
    await expect(input).toHaveValue("482913")
    await userEvent.keyboard("579")
    await expect(input.value).toHaveLength(6)
  })

  await step("removes the last digit with Backspace", async () => {
    await userEvent.keyboard("{Backspace}")
    await expect(input.value).toHaveLength(5)
    await expect(slots[5]).toHaveTextContent("")
  })
})
test("Filled", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <InputOtpFilled />
  )

  await step("shows the default value across the slots", async () => {
    await expect(
      canvas.getByRole("textbox", { name: "Verification code" })
    ).toHaveValue("482913")
    await expect(
      canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')[5]
    ).toHaveTextContent("3")
  })
})
test("Single Group", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <InputOtpSingleGroup />
  )

  const input = canvas.getByRole("textbox", { name: "Verification code" })
  const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')

  await step("fills the slots in order as digits are typed", async () => {
    await expect(slots).toHaveLength(6)
    await userEvent.click(input)
    await userEvent.keyboard("731")
    await expect(input).toHaveValue("731")
    await expect(slots[0]).toHaveTextContent("7")
    await expect(slots[2]).toHaveTextContent("1")
    await expect(slots[3]).toHaveAttribute("data-active", "true")
  })

  await step("completes the code in the last slot", async () => {
    await userEvent.keyboard("905")
    await expect(input).toHaveValue("731905")
    await expect(slots[5]).toHaveTextContent("5")
  })
})
test("Four Digits", async () => {
  const { canvas, step } = await renderExample(<InputOtpFourDigits />)

  const input = canvas.getByRole<HTMLInputElement>("textbox", {
    name: "Verification code",
  })

  await step("caps the code at four digits", async () => {
    await userEvent.click(input)
    await userEvent.keyboard("1234")
    await expect(input).toHaveValue("1234")
    await userEvent.keyboard("56")
    await expect(input.value).toHaveLength(4)
  })
})
test("Alphanumeric", async () => {
  const { canvas, step } = await renderExample(<InputOtpAlphanumeric />)

  const input = canvas.getByRole("textbox", { name: "Verification code" })

  await step("accepts letters and digits", async () => {
    await userEvent.click(input)
    await userEvent.keyboard("AB12")
    await expect(input).toHaveValue("AB12")
  })
})
test("Invalid", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <InputOtpInvalid />
  )

  await step("marks the input invalid and every slot with it", async () => {
    await expect(
      canvas.getByRole("textbox", { name: "Verification code" })
    ).toBeInvalid()
    const slots = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="input-otp-slot"]'
    )
    await expect(slots).toHaveLength(6)
    for (const slot of slots) {
      await expect(getComputedStyle(slot).borderBottomColor).not.toBe(
        "rgba(0, 0, 0, 0)"
      )
    }
    await expect(
      canvas.getByRole("textbox", { name: "Verification code" })
    ).toHaveValue("123456")
  })
})
test("Disabled", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <InputOtpDisabled />
  )

  await step("disables the input and keeps its value", async () => {
    const input = canvas.getByRole("textbox", { name: "Verification code" })
    await expect(input).toBeDisabled()
    await expect(input).toHaveValue("123456")
  })

  await step("greys out the slots without filling the row", async () => {
    await expect(
      canvasElement.querySelector("[data-input-otp-container]")
    ).toHaveStyle({
      backgroundColor: "rgba(0, 0, 0, 0)",
    })
    const separator = canvasElement.querySelector<HTMLElement>(
      '[data-slot="input-otp-separator"]'
    )
    await expect(separator).not.toBeNull()
    const slots = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="input-otp-slot"]'
    )
    await expect(slots).toHaveLength(6)
    for (const slot of slots) {
      const { backgroundColor, borderBottomColor } = getComputedStyle(slot)
      await expect([backgroundColor, borderBottomColor]).not.toEqual([
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0)",
      ])
      await expect(separator).toHaveStyle({
        color: getComputedStyle(slot).color,
      })
    }
  })
})
