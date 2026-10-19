"use client"

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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const areas = ["Billing", "Calendar", "Notifications", "Sharing", "Sync"]

export function ReportIssue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
        <CardDescription>We usually reply within one day.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="issue-title">Title</FieldLabel>
            <Input
              id="issue-title"
              placeholder="Reminders arrive an hour late"
            />
          </Field>
          <FieldSet>
            <FieldLegend variant="label">Severity</FieldLegend>
            <RadioGroup
              defaultValue="medium"
              aria-label="Severity"
              className="flex gap-5"
            >
              <Label>
                <RadioGroupItem value="low" />
                Low
              </Label>
              <Label>
                <RadioGroupItem value="medium" />
                Medium
              </Label>
              <Label>
                <RadioGroupItem value="high" />
                High
              </Label>
            </RadioGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="issue-area">Area</FieldLabel>
            <Combobox items={areas} defaultValue="Notifications">
              <ComboboxInput id="issue-area" placeholder="Search areas" />
              <ComboboxContent>
                <ComboboxEmpty>No area found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field>
            <FieldLabel htmlFor="issue-description">Description</FieldLabel>
            <Textarea
              id="issue-description"
              placeholder="What happened, and what did you expect?"
              className="min-h-20"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">
          <IconPlaceholder
            phosphor="PaperclipIcon"
            lucide="PaperclipIcon"
            tabler="IconPaperclip"
            hugeicons="Attachment01Icon"
            remixicon="RiAttachment2"
            data-icon="inline-start"
          />
          Attach file
        </Button>
        <Button className="ms-auto">Submit</Button>
      </CardFooter>
    </Card>
  )
}
