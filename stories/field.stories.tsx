import type { Meta, StoryObj } from "@storybook/react-vite"

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

export const Default: Story = {}

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
}

export const Invalid: Story = {
  render: (args) => (
    <Field {...args} data-invalid>
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input id="field-email" type="email" defaultValue="jane@" aria-invalid />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
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
}

export const Disabled: Story = {
  render: (args) => (
    <Field {...args} data-disabled>
      <FieldLabel htmlFor="field-disabled">Workspace URL</FieldLabel>
      <Input id="field-disabled" defaultValue="acme.example.com" disabled />
      <FieldDescription>Contact an admin to change this.</FieldDescription>
    </Field>
  ),
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
