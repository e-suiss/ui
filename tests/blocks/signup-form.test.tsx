import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SignupForm } from "@/components/blocks/signup-form"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const field = (name: string) => page.getByRole("textbox", { name, exact: true })
const password = () => page.getByLabelText("Password", { exact: true })
const confirm = () => page.getByLabelText("Confirm password")
const submit = () => page.getByRole("button", { name: "Continue" })
const error = () => page.getByText("Please fill in every field correctly.")

function rules() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("fieldset li"),
    (item) => item.textContent
  )
}

async function fillValid(overrides: Record<string, string> = {}) {
  const values = {
    first: "Jamie",
    last: "Rivera",
    birthday: "04/12/1990",
    email: "jamie@suiss.com",
    password: "Sunrise2026",
    confirm: "Sunrise2026",
    ...overrides,
  }
  await field("First name").fill(values.first)
  await field("Last name").fill(values.last)
  await field("Birthday").fill(values.birthday)
  await field("Email").fill(values.email)
  await password().fill(values.password)
  await confirm().fill(values.confirm)
}

describe("SignupForm", () => {
  it("shows the empty form without errors", async () => {
    await render(<SignupForm />)
    await expect
      .element(page.getByRole("heading", { name: "Create your suiss Account" }))
      .toBeVisible()
    await expect.element(error()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("combobox", { name: "Country or region" }))
      .toHaveValue("United States")
    await expect
      .element(field("Email"))
      .toHaveAccessibleDescription("This will be your new suiss Account.")
  })

  it("asks to fix the form when submitted empty", async () => {
    await render(<SignupForm />)
    await submit().click()
    await expect.element(error()).toBeVisible()
    await expect
      .element(page.getByRole("heading", { name: "Create your suiss Account" }))
      .toBeVisible()
  })

  it("checks off password rules as they are met", async () => {
    await render(<SignupForm />)
    await password().fill("abc")
    await expect
      .poll(rules)
      .toEqual([
        "At least 8 characters(not met)",
        "Upper and lowercase letters(not met)",
        "At least one number(not met)",
      ])
    await password().fill("abcdefgH")
    await expect
      .poll(rules)
      .toEqual([
        "At least 8 characters(met)",
        "Upper and lowercase letters(met)",
        "At least one number(not met)",
      ])
    await password().fill("abcdefgH1")
    await expect
      .poll(() => document.querySelectorAll("fieldset li[data-met]").length)
      .toBe(3)
  })

  it("rejects an invalid email", async () => {
    await render(<SignupForm />)
    await fillValid({ email: "jamie@suiss" })
    await submit().click()
    await expect.element(error()).toBeVisible()
    await field("Email").fill("jamie@suiss.com")
    await expect.element(error()).not.toBeInTheDocument()
  })

  it("rejects a weak password", async () => {
    await render(<SignupForm />)
    await fillValid({ password: "sunrise", confirm: "sunrise" })
    await submit().click()
    await expect.element(error()).toBeVisible()
  })

  it("flags mismatched passwords only after a submit attempt", async () => {
    await render(<SignupForm />)
    await fillValid({ confirm: "Sunrise2025" })
    await expect.element(confirm()).not.toHaveAttribute("aria-invalid")
    await submit().click()
    await expect.element(confirm()).toHaveAttribute("aria-invalid", "true")
    expect(
      confirm().element().parentElement?.hasAttribute("data-invalid")
    ).toBe(true)
    await expect.element(error()).toBeVisible()
    await confirm().fill("Sunrise2026")
    await expect.element(confirm()).not.toHaveAttribute("aria-invalid")
    await expect.element(error()).not.toBeInTheDocument()
  })

  it("requires the birthday", async () => {
    await render(<SignupForm />)
    await fillValid({ birthday: "" })
    await submit().click()
    await expect.element(error()).toBeVisible()
  })

  it("creates the account and starts over", async () => {
    await render(<SignupForm />)
    await fillValid()
    await page
      .getByRole("combobox", { name: "Country or region" })
      .selectOptions("Germany")
    await submit().click()
    await expect
      .element(
        page.getByRole("heading", { name: "Your suiss Account is ready." })
      )
      .toBeVisible()
    await expect
      .element(
        page.getByText("We sent a verification code to jamie@suiss.com.")
      )
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect.element(field("First name")).toHaveValue("Jamie")
    await expect
      .element(page.getByRole("combobox", { name: "Country or region" }))
      .toHaveValue("Germany")
    await expect.element(error()).not.toBeInTheDocument()
  })

  it("submits with the enter key", async () => {
    await render(<SignupForm />)
    await fillValid()
    await userEvent.keyboard("{Enter}")
    await expect
      .element(
        page.getByRole("heading", { name: "Your suiss Account is ready." })
      )
      .toBeVisible()
  })

  it("keeps the name fields side by side on a phone", async () => {
    await page.viewport(390, 844)
    await render(<SignupForm />)
    await expect.element(field("First name")).toBeVisible()
    const first = field("First name").element().getBoundingClientRect()
    const last = field("Last name").element().getBoundingClientRect()
    expect(last.top).toBe(first.top)
    expect(last.left).toBeGreaterThan(first.right)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(390)
  })
})
