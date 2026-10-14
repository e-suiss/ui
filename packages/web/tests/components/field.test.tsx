import * as React from "react"
import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function EmailField() {
  const [error, setError] = React.useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" aria-invalid={error || undefined} />
      <FieldDescription>We never share it.</FieldDescription>
      {error && <FieldError>Enter a valid email.</FieldError>}
      <button type="button" onClick={() => setError((value) => !value)}>
        Toggle error
      </button>
    </Field>
  )
}

describe("Field", () => {
  it("describes its control with its description", async () => {
    await render(<EmailField />)
    await expect
      .element(page.getByRole("textbox", { name: "Email" }))
      .toHaveAccessibleDescription("We never share it.")
  })

  it("adds an error to the description while it is shown", async () => {
    await render(<EmailField />)
    const input = page.getByRole("textbox", { name: "Email" })
    await page.getByRole("button", { name: "Toggle error" }).click()
    await expect
      .element(input)
      .toHaveAccessibleDescription("We never share it. Enter a valid email.")
    await page.getByRole("button", { name: "Toggle error" }).click()
    await expect
      .element(input)
      .toHaveAccessibleDescription("We never share it.")
  })

  it("keeps a description the control already points to", async () => {
    await render(
      <>
        <p id="hint">Used for invoices.</p>
        <Field>
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <Input id="company" aria-describedby="hint" />
          <FieldDescription>Legal name.</FieldDescription>
        </Field>
      </>
    )
    await expect
      .element(page.getByRole("textbox", { name: "Company" }))
      .toHaveAccessibleDescription("Used for invoices. Legal name.")
  })

  it("leaves nested fields to describe their own controls", async () => {
    await render(
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea id="bio" />
        <FieldDescription>Shown on your profile.</FieldDescription>
        <Field orientation="horizontal">
          <Switch id="public" aria-label="Public" />
          <FieldDescription>Anyone can see it.</FieldDescription>
        </Field>
      </Field>
    )
    await expect
      .element(page.getByRole("textbox", { name: "Bio" }))
      .toHaveAccessibleDescription("Shown on your profile.")
    await expect
      .element(page.getByRole("switch", { name: "Public" }))
      .toHaveAccessibleDescription("Anyone can see it.")
  })

  it("describes a checkbox laid out with field content", async () => {
    await render(
      <Field orientation="horizontal">
        <Checkbox id="updates" />
        <FieldContent>
          <FieldLabel htmlFor="updates">Product updates</FieldLabel>
          <FieldDescription>Get an email for new features.</FieldDescription>
        </FieldContent>
      </Field>
    )
    await expect
      .element(page.getByRole("checkbox", { name: "Product updates" }))
      .toHaveAccessibleDescription("Get an email for new features.")
  })
})
