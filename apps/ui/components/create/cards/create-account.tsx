import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function CreateAccount() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          One account for your home, music and notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="create-account-name">Full name</FieldLabel>
            <Input id="create-account-name" placeholder="Maya Lindqvist" />
          </Field>
          <Field>
            <FieldLabel htmlFor="create-account-email">Email</FieldLabel>
            <Input
              id="create-account-email"
              type="email"
              placeholder="maya@example.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="create-account-password">Password</FieldLabel>
            <Input id="create-account-password" type="password" />
            <FieldDescription>
              At least 8 characters, with a number or symbol.
            </FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="create-account-terms" />
            <FieldLabel htmlFor="create-account-terms" className="font-normal">
              I agree to the Terms and Privacy Policy
            </FieldLabel>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  )
}
