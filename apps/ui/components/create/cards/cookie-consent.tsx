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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function CookieConsent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie preferences</CardTitle>
        <CardDescription>
          We use cookies to keep you signed in and to understand how the app is
          used. Choose what you are comfortable with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="cookie-necessary">
                Strictly necessary
              </FieldLabel>
              <FieldDescription>
                Required for sign in and security.
              </FieldDescription>
            </FieldContent>
            <Switch id="cookie-necessary" defaultChecked disabled />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="cookie-analytics">Analytics</FieldLabel>
              <FieldDescription>
                Helps us see which features people use.
              </FieldDescription>
            </FieldContent>
            <Switch id="cookie-analytics" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="cookie-marketing">Marketing</FieldLabel>
              <FieldDescription>
                Personalized offers on other sites.
              </FieldDescription>
            </FieldContent>
            <Switch id="cookie-marketing" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Reject all
        </Button>
        <Button className="flex-1">Accept all</Button>
      </CardFooter>
    </Card>
  )
}
