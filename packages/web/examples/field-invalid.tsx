import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldInvalid() {
  return (
    <Field orientation="vertical" data-invalid className="w-96">
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input id="field-email" type="email" defaultValue="jane@" aria-invalid />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  )
}
