import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function FeedbackForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share your feedback</CardTitle>
        <CardDescription>
          How was your experience with the new planner?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Rating</FieldLabel>
            <ToggleGroup
              variant="outline"
              spacing={2}
              defaultValue={["4"]}
              aria-label="Rating"
              className="w-full"
            >
              <ToggleGroupItem value="1" className="flex-1">
                1
              </ToggleGroupItem>
              <ToggleGroupItem value="2" className="flex-1">
                2
              </ToggleGroupItem>
              <ToggleGroupItem value="3" className="flex-1">
                3
              </ToggleGroupItem>
              <ToggleGroupItem value="4" className="flex-1">
                4
              </ToggleGroupItem>
              <ToggleGroupItem value="5" className="flex-1">
                5
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="feedback-topic">Topic</FieldLabel>
            <Select
              defaultValue="planning"
              items={{
                planning: "Weekly planning",
                reminders: "Reminders",
                sync: "Sync across devices",
                other: "Something else",
              }}
            >
              <SelectTrigger id="feedback-topic" className="w-full">
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="planning">Weekly planning</SelectItem>
                  <SelectItem value="reminders">Reminders</SelectItem>
                  <SelectItem value="sync">Sync across devices</SelectItem>
                  <SelectItem value="other">Something else</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="feedback-message">Message</FieldLabel>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what worked and what didn't."
              className="min-h-24"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Send feedback</Button>
      </CardFooter>
    </Card>
  )
}
