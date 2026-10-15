import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function FieldWithTextarea() {
  return (
    <div className="w-96">
      <Field orientation="vertical">
        <FieldLabel htmlFor="field-feedback">Feedback</FieldLabel>
        <Textarea
          id="field-feedback"
          placeholder="Tell us what you think..."
          rows={4}
        />
        <FieldDescription>Your feedback helps us improve.</FieldDescription>
      </Field>
    </div>
  )
}
