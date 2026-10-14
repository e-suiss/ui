import type { Meta, StoryObj } from "@storybook/react-native"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here.",
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue:
      "The quick brown fox jumps over the lazy dog. This text spans a few lines to show how the textarea handles longer content.",
  },
}

export const WithLabel: Story = {
  render: () => (
    <Field>
      <FieldLabel>Your message</FieldLabel>
      <Textarea placeholder="Type your message here." />
      <FieldDescription>
        Your message will be copied to the team.
      </FieldDescription>
    </Field>
  ),
}

export const Disabled: Story = {
  args: {
    editable: false,
    placeholder: "Disabled",
  },
}

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Too short" />
      <FieldError>Message must be at least 20 characters.</FieldError>
    </Field>
  ),
}
