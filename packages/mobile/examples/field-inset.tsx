import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldInset() {
  return (
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup variant="inset">
        <Field orientation="horizontal">
          <FieldLabel className="flex-1 font-normal">Name</FieldLabel>
          <Input
            className="h-8 flex-1 bg-transparent px-0 text-right"
            defaultValue="Ada Lovelace"
          />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel className="flex-1 font-normal">City</FieldLabel>
          <Input
            className="h-8 flex-1 bg-transparent px-0 text-right"
            defaultValue="London"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
