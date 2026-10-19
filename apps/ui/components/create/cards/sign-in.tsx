import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to pick up where you left off.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Button variant="outline">
              <IconPlaceholder
                phosphor="KeyIcon"
                lucide="KeyIcon"
                tabler="IconKey"
                hugeicons="Key01Icon"
                remixicon="RiKey2Line"
                data-icon="inline-start"
              />
              Continue with passkey
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            or
          </FieldSeparator>
          <Field>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input
              id="sign-in-email"
              type="email"
              placeholder="maya@example.com"
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <a
                href="#forgot-password"
                className="text-muted-foreground text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input id="sign-in-password" type="password" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button className="w-full">Sign in</Button>
        <p className="text-center text-muted-foreground text-sm">
          New here?{" "}
          <a
            href="#create-account"
            className="text-foreground underline underline-offset-4"
          >
            Create an account
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
