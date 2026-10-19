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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Control who can see your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">Profile visibility</FieldLegend>
            <RadioGroup defaultValue="friends" aria-label="Profile visibility">
              <FieldLabel htmlFor="visibility-everyone">
                <Field orientation="horizontal">
                  <RadioGroupItem value="everyone" id="visibility-everyone" />
                  <FieldContent>
                    <FieldTitle>Everyone</FieldTitle>
                    <FieldDescription>
                      Anyone can find you and view your posts.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="visibility-friends">
                <Field orientation="horizontal">
                  <RadioGroupItem value="friends" id="visibility-friends" />
                  <FieldContent>
                    <FieldTitle>Friends only</FieldTitle>
                    <FieldDescription>
                      Only people you have accepted.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="visibility-private">
                <Field orientation="horizontal">
                  <RadioGroupItem value="private" id="visibility-private" />
                  <FieldContent>
                    <FieldTitle>Only me</FieldTitle>
                    <FieldDescription>
                      Your profile stays hidden from search.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <Field orientation="horizontal">
              <Checkbox id="privacy-location" />
              <FieldLabel htmlFor="privacy-location">
                Share location in photos
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="privacy-status" defaultChecked />
              <FieldLabel htmlFor="privacy-status">
                Show when I&apos;m online
              </FieldLabel>
            </Field>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save changes</Button>
      </CardFooter>
    </Card>
  )
}
