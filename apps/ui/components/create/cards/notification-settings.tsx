import {
  Card,
  CardContent,
  CardDescription,
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

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what reaches you and when.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="notify-messages">Messages</FieldLabel>
              <FieldDescription>Direct messages and mentions.</FieldDescription>
            </FieldContent>
            <Switch id="notify-messages" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="notify-reminders">Reminders</FieldLabel>
              <FieldDescription>Tasks and calendar events.</FieldDescription>
            </FieldContent>
            <Switch id="notify-reminders" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="notify-activity">Activity</FieldLabel>
              <FieldDescription>
                A weekly summary of your workouts.
              </FieldDescription>
            </FieldContent>
            <Switch id="notify-activity" />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="notify-offers">Offers</FieldLabel>
              <FieldDescription>
                News about features and offers.
              </FieldDescription>
            </FieldContent>
            <Switch id="notify-offers" />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
