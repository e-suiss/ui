import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

export default function FieldLarge() {
  return (
    <FieldGroup>
      <Field size="lg">
        <FieldLabel>Email</FieldLabel>
        <Input
          size="lg"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="jane@example.com"
        />
      </Field>
      <Field size="lg">
        <FieldLabel>Password</FieldLabel>
        <Input size="lg" secureTextEntry autoComplete="password" />
      </Field>
      <Button block size="form">
        <Text>Continue</Text>
      </Button>
    </FieldGroup>
  )
}
