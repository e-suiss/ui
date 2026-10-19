import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldSeparatorWithText() {
  return (
    <FieldGroup className="w-96">
      <Field>
        <Button variant="outline">Continue with Apple</Button>
      </Field>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="sep-email">Email</FieldLabel>
        <Input id="sep-email" type="email" placeholder="jane@example.com" />
      </Field>
    </FieldGroup>
  )
}
