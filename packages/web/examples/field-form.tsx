import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function FieldForm() {
  return (
    <div className="w-96">
      <form onSubmit={(event) => event.preventDefault()}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Name on card</FieldLabel>
                <Input id="form-name" placeholder="Jane Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-number">Card number</FieldLabel>
                <Input
                  id="form-number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>Enter your 16-digit number.</FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="form-exp">Expiry</FieldLabel>
                  <Input id="form-exp" placeholder="MM/YY" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="form-cvv">CVV</FieldLabel>
                  <Input id="form-cvv" placeholder="123" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing address</FieldLegend>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="form-same" defaultChecked />
                <FieldLabel htmlFor="form-same" className="font-normal">
                  Same as shipping address
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-notes">Notes</FieldLabel>
                <Textarea
                  id="form-notes"
                  placeholder="Add any additional comments"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
