import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function FieldHorizontal() {
  return (
    <FieldGroup className="w-96">
      <Field orientation="horizontal">
        <Checkbox id="field-terms" defaultChecked />
        <FieldLabel htmlFor="field-terms">
          Accept terms and conditions
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
          <FieldDescription>
            Receive emails about new products and features.
          </FieldDescription>
        </FieldContent>
        <Switch id="field-marketing" />
      </Field>
    </FieldGroup>
  )
}
