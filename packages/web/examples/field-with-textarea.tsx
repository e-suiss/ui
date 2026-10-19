import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function FieldWithTextarea() {
  return (
    <Field orientation="vertical" className="w-96">
      <FieldLabel htmlFor="field-feedback">Feedback</FieldLabel>
      <Textarea
        id="field-feedback"
        placeholder="Tell us what you think..."
        rows={4}
      />
      <FieldDescription>Your feedback helps us improve.</FieldDescription>
    </Field>
  )
}
