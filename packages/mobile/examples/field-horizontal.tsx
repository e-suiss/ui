import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function FieldHorizontal() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>
            Receive emails about new products.
          </FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Security emails</FieldTitle>
          <FieldDescription>
            Receive emails about your account.
          </FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
    </FieldGroup>
  )
}
