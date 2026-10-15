import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldInvalid() {
  return (
    <div className="w-96">
      <Field orientation="vertical" data-invalid>
        <FieldLabel htmlFor="field-email">Email</FieldLabel>
        <Input
          id="field-email"
          type="email"
          defaultValue="jane@"
          aria-invalid
        />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </div>
  )
}
