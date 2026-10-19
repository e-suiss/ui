import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function ShippingAddress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping address</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="shipping-name">Full name</FieldLabel>
            <Input id="shipping-name" defaultValue="Maya Lindqvist" />
          </Field>
          <Field>
            <FieldLabel htmlFor="shipping-street">Street address</FieldLabel>
            <Input id="shipping-street" placeholder="12 Harbor Lane, Apt 4" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="shipping-city">City</FieldLabel>
              <Input id="shipping-city" placeholder="Lisbon" />
            </Field>
            <Field>
              <FieldLabel htmlFor="shipping-postal">Postal code</FieldLabel>
              <Input id="shipping-postal" placeholder="1100-148" />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="shipping-country">Country</FieldLabel>
            <Select
              defaultValue="pt"
              items={{
                pt: "Portugal",
                es: "Spain",
                fr: "France",
                de: "Germany",
                nl: "Netherlands",
              }}
            >
              <SelectTrigger id="shipping-country" className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Portugal</SelectItem>
                <SelectItem value="es">Spain</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="nl">Netherlands</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="shipping-save">Save this address</FieldLabel>
            <Switch id="shipping-save" defaultChecked />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Back
        </Button>
        <Button className="flex-1">Continue</Button>
      </CardFooter>
    </Card>
  )
}
