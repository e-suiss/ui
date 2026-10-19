import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldDisabled() {
  return (
    <Field orientation="vertical" data-disabled className="w-96">
      <FieldLabel htmlFor="field-disabled">Workspace URL</FieldLabel>
      <Input id="field-disabled" defaultValue="acme.example.com" disabled />
      <FieldDescription>Contact an admin to change this.</FieldDescription>
    </Field>
  )
}
