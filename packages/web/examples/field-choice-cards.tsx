import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FieldChoiceCards() {
  return (
    <FieldSet className="w-96">
      <FieldLegend variant="label">Plan</FieldLegend>
      <FieldDescription>Select the plan that fits your team.</FieldDescription>
      <RadioGroup defaultValue="pro" aria-label="Plan">
        <FieldLabel htmlFor="plan-starter">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Starter</FieldTitle>
              <FieldDescription>
                For individuals and small projects.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="starter" id="plan-starter" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="plan-pro">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Pro</FieldTitle>
              <FieldDescription>
                For growing teams that need more.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="pro" id="plan-pro" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  )
}
