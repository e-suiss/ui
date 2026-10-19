import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldMultipleErrors() {
  return (
    <Field orientation="vertical" data-invalid className="w-96">
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
  )
}
