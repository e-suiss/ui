import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldLarge() {
  return (
    <form className="w-80">
      <FieldGroup>
        <Field size="lg">
          <FieldLabel htmlFor="field-large-email">Email</FieldLabel>
          <Input
            id="field-large-email"
            type="email"
            size="lg"
            placeholder="jane@example.com"
          />
        </Field>
        <Field size="lg">
          <FieldLabel htmlFor="field-large-password">Password</FieldLabel>
          <Input id="field-large-password" type="password" size="lg" />
        </Field>
        <Button type="submit" block size="form">
          Continue
        </Button>
      </FieldGroup>
    </form>
  )
}
