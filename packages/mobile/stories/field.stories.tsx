import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import * as CheckboxGroupPrimitive from "@/components/primitives/checkbox-group"
import * as FormPrimitive from "@/components/primitives/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="evilrabbit" autoCapitalize="none" />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <Input
        defaultValue="hello@"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FieldDescription>
        We will send a confirmation link here.
      </FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Validation: Story = {
  render: () => (
    <FieldGroup>
      <Field validationMode="onBlur">
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Required" required />
        <FieldError />
      </Field>
      <Field
        validationMode="onChange"
        validate={(value) =>
          typeof value === "string" && value.includes("@")
            ? null
            : "Email must contain @."
        }
      >
        <FieldLabel>Email</FieldLabel>
        <Input
          placeholder="m@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FieldDescription>Validated on every change.</FieldDescription>
        <FieldError />
      </Field>
      <Field validationMode="onBlur">
        <FieldLabel>Bio</FieldLabel>
        <Textarea placeholder="At least 20 characters" minLength={20} />
        <FieldError match="tooShort">Tell us a little more.</FieldError>
      </Field>
    </FieldGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Workspace</FieldLabel>
      <Input defaultValue="acme" />
      <FieldDescription>Contact an admin to change this.</FieldDescription>
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
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
  ),
}

const TOPPINGS = ["cheese", "olives", "peppers"]

function ToppingsDemo() {
  const [value, setValue] = React.useState<string[]>(["cheese"])
  return (
    <FieldSet>
      <FieldLegend>Toppings</FieldLegend>
      <FieldDescription>Choose what goes on your pizza.</FieldDescription>
      <CheckboxGroupPrimitive.Root
        value={value}
        onValueChange={setValue}
        allValues={TOPPINGS}
        className="gap-3"
      >
        <View className="flex-row items-center gap-3">
          <Checkbox parent />
          <Text>All toppings</Text>
        </View>
        {TOPPINGS.map((topping) => (
          <View key={topping} className="flex-row items-center gap-3 ps-6">
            <Checkbox value={topping} />
            <Text className="capitalize">{topping}</Text>
          </View>
        ))}
      </CheckboxGroupPrimitive.Root>
    </FieldSet>
  )
}

export const CheckboxGroup: Story = {
  render: () => <ToppingsDemo />,
}

export const Inset: Story = {
  render: () => (
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
  ),
}

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
            typeof value === "string" && /\d/.test(value)
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

export const Form: Story = {
  render: () => <FormDemo />,
}
