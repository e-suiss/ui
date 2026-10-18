import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaInvalid() {
  return (
    <Field invalid>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Too short" />
      <FieldError>Message must be at least 20 characters.</FieldError>
    </Field>
  )
}
