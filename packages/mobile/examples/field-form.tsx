import * as React from "react"
import * as FormPrimitive from "@/components/primitives/form"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

const DIGIT = /\d/

function FormDemo() {
  const actionsRef = React.useRef<FormPrimitive.Actions | null>(null)
  const [errors, setErrors] = React.useState<FormPrimitive.Errors>({})
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <FormPrimitive.Root
      actionsRef={actionsRef}
      errors={errors}
      onFormSubmit={(values) => {
        if (values.username === "admin") {
          setErrors({ username: "This username is taken." })
          return
        }
        setSubmitted(JSON.stringify(values))
      }}
      className="gap-6"
    >
      <FieldGroup>
        <Field name="username">
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="Try admin" autoCapitalize="none" required />
          <FieldDescription>Letters and numbers only.</FieldDescription>
          <FieldError />
        </Field>
        <Field
          name="password"
          validate={(value) =>
            typeof value === "string" && DIGIT.test(value)
              ? null
              : "Include at least one number."
          }
        >
          <FieldLabel>Password</FieldLabel>
          <Input secureTextEntry required minLength={8} />
          <FieldError />
        </Field>
      </FieldGroup>
      <Button onPress={() => actionsRef.current?.submit()}>
        <Text>Create account</Text>
      </Button>
      {submitted ? <Text variant="muted">Submitted: {submitted}</Text> : null}
    </FormPrimitive.Root>
  )
}

export default function FieldForm() {
  return <FormDemo />
}
