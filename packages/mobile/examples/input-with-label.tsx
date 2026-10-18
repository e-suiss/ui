import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function InputWithLabel() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input
        placeholder="m@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FieldDescription>We will never share your email.</FieldDescription>
    </Field>
  )
}
