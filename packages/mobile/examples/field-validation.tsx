import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function FieldValidation() {
  return (
    <FieldGroup>
      <Field validationMode="onBlur">
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Required" required />
        <FieldError />
      </Field>
      <Field
        validationMode="onChange"
        validate={(value) =>
          typeof value === "string" && value.includes("@")
            ? null
            : "Email must contain @."
        }
      >
        <FieldLabel>Email</FieldLabel>
        <Input
          placeholder="m@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FieldDescription>Validated on every change.</FieldDescription>
        <FieldError />
      </Field>
      <Field validationMode="onBlur">
        <FieldLabel>Bio</FieldLabel>
        <Textarea placeholder="At least 20 characters" minLength={20} />
        <FieldError match="tooShort">Tell us a little more.</FieldError>
      </Field>
    </FieldGroup>
  )
}
