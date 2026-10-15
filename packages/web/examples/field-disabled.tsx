import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldDisabled() {
  return (
    <div className="w-96">
      <Field orientation="vertical" data-disabled>
        <FieldLabel htmlFor="field-disabled">Workspace URL</FieldLabel>
        <Input id="field-disabled" defaultValue="acme.example.com" disabled />
        <FieldDescription>Contact an admin to change this.</FieldDescription>
      </Field>
    </div>
  )
}
