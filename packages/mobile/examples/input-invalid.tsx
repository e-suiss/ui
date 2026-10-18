import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function InputInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Username</FieldLabel>
      <Input defaultValue="x" />
      <FieldError>Username must be at least 3 characters.</FieldError>
    </Field>
  )
}
