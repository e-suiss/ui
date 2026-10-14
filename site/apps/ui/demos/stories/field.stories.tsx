// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Field",
  component: Field,
  args: {
    orientation: "vertical",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-username">Username</FieldLabel>
      <Input id="field-username" placeholder="janedoe" />
      <FieldDescription>
        Choose a unique name for your account.
      </FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Username" })

    await step("names the input and focuses it from the label", async () => {
      await expect(input).toHaveAccessibleDescription(
        "Choose a unique name for your account."
      )
      await userEvent.click(canvas.getByText("Username"))
      await expect(input).toHaveFocus()
      await userEvent.keyboard("ada")
      await expect(input).toHaveValue("ada")
    })
  },
}

export const WithHelpLink: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-serial">Serial number</FieldLabel>
      <Input id="field-serial" placeholder="C02XL0GTJGH5" />
      <FieldDescription>
        Printed on the back of the device.{" "}
        <a href="#serial-help">Find your serial number</a>
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Serial number" })

    await step("focuses the input from its label", async () => {
      await userEvent.click(canvas.getByText("Serial number"))
      await expect(input).toHaveFocus()
      await userEvent.keyboard("C02XL0GTJGH5")
      await expect(input).toHaveValue("C02XL0GTJGH5")
    })

    await step("reaches the help link after the input", async () => {
      const link = canvas.getByRole("link", { name: "Find your serial number" })
      await expect(link).toHaveAttribute("href", "#serial-help")
      await userEvent.tab()
      await expect(link).toHaveFocus()
    })
  },
}

export const Inset: Story = {
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend>Account</FieldLegend>
      <FieldGroup variant="inset">
        <Field orientation="horizontal">
          <FieldLabel htmlFor="inset-name">Name</FieldLabel>
          <Input id="inset-name" defaultValue="Jordan Lee" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="inset-email">Email</FieldLabel>
          <Input id="inset-email" defaultValue="jordan@acme.com" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="inset-updates">Product updates</FieldLabel>
          <Switch id="inset-updates" defaultChecked />
        </Field>
      </FieldGroup>
      <FieldDescription>
        Your name and email appear on invoices.
      </FieldDescription>
    </FieldSet>
  ),
}

export const WithTextarea: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-feedback">Feedback</FieldLabel>
      <Textarea
        id="field-feedback"
        placeholder="Tell us what you think..."
        rows={4}
      />
      <FieldDescription>Your feedback helps us improve.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole("textbox", { name: "Feedback" })

    await step("names the textarea and focuses it from the label", async () => {
      await expect(textarea).toHaveAttribute("rows", "4")
      await expect(textarea).toHaveAccessibleDescription(
        "Your feedback helps us improve."
      )
      await userEvent.click(canvas.getByText("Feedback"))
      await expect(textarea).toHaveFocus()
    })

    await step("accepts multi-line text", async () => {
      await userEvent.keyboard("Great{Enter}work")
      await expect(textarea).toHaveValue("Great\nwork")
    })
  },
}

export const Invalid: Story = {
  render: (args) => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input id="field-email" type="email" defaultValue="jane@" aria-invalid />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
  play: async ({ canvas, step }) => {
    await step("flags the input and announces the error", async () => {
      await expect(canvas.getByRole("textbox", { name: "Email" })).toBeInvalid()
      await expect(canvas.getByRole("alert")).toHaveTextContent(
        "Enter a valid email address."
      )
    })
  },
}

export const MultipleErrors: Story = {
  render: (args) => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="field-password">Password</FieldLabel>
      <Input
        id="field-password"
        type="password"
        defaultValue="abc"
        aria-invalid
      />
      <FieldError
        errors={[
          { message: "Password must be at least 8 characters." },
          { message: "Password must contain a number." },
        ]}
      />
    </Field>
  ),
  play: async ({ canvas, step }) => {
    await step("lists every error in one alert", async () => {
      const alert = canvas.getByRole("alert")
      await expect(within(alert).getAllByRole("listitem")).toHaveLength(2)
    })
  },
}

export const Disabled: Story = {
  render: (args) => (
    <Field {...args} data-disabled>
      <FieldLabel htmlFor="field-disabled">Workspace URL</FieldLabel>
      <Input id="field-disabled" defaultValue="acme.example.com" disabled />
      <FieldDescription>Contact an admin to change this.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas, step }) => {
    await step("disables the named input", async () => {
      await expect(
        canvas.getByRole("textbox", { name: "Workspace URL" })
      ).toBeDisabled()
    })
  },
}

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <FieldGroup>
      <Field {...args}>
        <Checkbox id="field-terms" defaultChecked />
        <FieldLabel htmlFor="field-terms">
          Accept terms and conditions
        </FieldLabel>
      </Field>
      <Field {...args}>
        <FieldContent>
          <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
          <FieldDescription>
            Receive emails about new products and features.
          </FieldDescription>
        </FieldContent>
        <Switch id="field-marketing" />
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvas, step }) => {
    await step("toggles each control from its label", async () => {
      const terms = canvas.getByRole("checkbox", {
        name: "Accept terms and conditions",
      })
      await expect(terms).toBeChecked()
      await userEvent.click(canvas.getByText("Accept terms and conditions"))
      await expect(terms).not.toBeChecked()

      const marketing = canvas.getByRole("switch", { name: "Marketing emails" })
      await userEvent.click(canvas.getByText("Marketing emails"))
      await expect(marketing).toHaveAttribute("aria-checked", "true")
    })
  },
}

export const ChoiceCards: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Plan</FieldLegend>
      <FieldDescription>Select the plan that fits your team.</FieldDescription>
      <RadioGroup defaultValue="pro">
        <FieldLabel htmlFor="plan-starter">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Starter</FieldTitle>
              <FieldDescription>
                For individuals and small projects.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="starter" id="plan-starter" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="plan-pro">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Pro</FieldTitle>
              <FieldDescription>
                For growing teams that need more.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="pro" id="plan-pro" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas, step }) => {
    const [starter, pro] = canvas.getAllByRole("radio")

    await step("selects a plan by clicking its card", async () => {
      await expect(pro).toHaveAttribute("aria-checked", "true")
      await userEvent.click(canvas.getByText("Starter"))
      await expect(starter).toHaveAttribute("aria-checked", "true")
      await expect(pro).toHaveAttribute("aria-checked", "false")
    })
  },
}

export const Form: Story = {
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Payment method</FieldLegend>
          <FieldDescription>
            All transactions are secure and encrypted.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-name">Name on card</FieldLabel>
              <Input id="form-name" placeholder="Jane Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="form-number">Card number</FieldLabel>
              <Input
                id="form-number"
                placeholder="1234 5678 9012 3456"
                required
              />
              <FieldDescription>Enter your 16-digit number.</FieldDescription>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="form-exp">Expiry</FieldLabel>
                <Input id="form-exp" placeholder="MM/YY" />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-cvv">CVV</FieldLabel>
                <Input id="form-cvv" placeholder="123" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Billing address</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="form-same" defaultChecked />
              <FieldLabel htmlFor="form-same" className="font-normal">
                Same as shipping address
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-notes">Notes</FieldLabel>
              <Textarea
                id="form-notes"
                placeholder="Add any additional comments"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  ),
  play: async ({ canvas, step }) => {
    await step("groups the fields under their legends", async () => {
      await expect(
        canvas.getByRole("group", { name: "Payment method" })
      ).toBeVisible()
      await expect(
        canvas.getByRole("group", { name: "Billing address" })
      ).toBeVisible()
    })

    await step("marks the required fields", async () => {
      await expect(
        canvas.getByRole("textbox", { name: "Name on card" })
      ).toBeRequired()
      await expect(
        canvas.getByRole("textbox", { name: "Card number" })
      ).toBeRequired()
      await expect(
        canvas.getByRole("textbox", { name: "CVV" })
      ).not.toBeRequired()
    })
  },
}

export const SeparatorWithText: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <Button variant="outline">Continue with Apple</Button>
      </Field>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="sep-email">Email</FieldLabel>
        <Input id="sep-email" type="email" placeholder="jane@example.com" />
      </Field>
    </FieldGroup>
  ),
}
