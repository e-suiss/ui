import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldDemo() {
  return (
    <div className="w-96">
      <Field orientation="vertical">
        <FieldLabel htmlFor="field-username">Username</FieldLabel>
        <Input id="field-username" placeholder="janedoe" />
        <FieldDescription>
          Choose a unique name for your account.
        </FieldDescription>
      </Field>
    </div>
  )
}
