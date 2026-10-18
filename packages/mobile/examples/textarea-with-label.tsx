import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithLabel() {
  return (
    <Field>
      <FieldLabel>Your message</FieldLabel>
      <Textarea placeholder="Type your message here." />
      <FieldDescription>
        Your message will be copied to the team.
      </FieldDescription>
    </Field>
  )
}
