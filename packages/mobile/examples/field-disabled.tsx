import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldDisabled() {
  return (
    <Field disabled>
      <FieldLabel>Workspace</FieldLabel>
      <Input defaultValue="acme" />
      <FieldDescription>Contact an admin to change this.</FieldDescription>
    </Field>
  )
}
