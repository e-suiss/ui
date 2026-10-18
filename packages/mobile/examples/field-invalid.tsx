import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <Input
        defaultValue="hello@"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FieldDescription>
        We will send a confirmation link here.
      </FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  )
}
