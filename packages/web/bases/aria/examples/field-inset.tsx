import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function FieldInset() {
  return (
    <div className="w-96">
      <FieldSet className="w-96">
        <FieldLegend>Account</FieldLegend>
        <FieldGroup variant="inset">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="inset-name">Name</FieldLabel>
            <Input id="inset-name" defaultValue="Jordan Lee" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="inset-email">Email</FieldLabel>
            <Input id="inset-email" defaultValue="jordan@acme.com" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="inset-updates">Product updates</FieldLabel>
            <Switch id="inset-updates" defaultSelected />
          </Field>
        </FieldGroup>
        <FieldDescription>
          Your name and email appear on invoices.
        </FieldDescription>
      </FieldSet>
    </div>
  )
}
