import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldWithHelpLink() {
  return (
    <Field orientation="vertical" className="w-96">
      <FieldLabel htmlFor="field-serial">Serial number</FieldLabel>
      <Input id="field-serial" placeholder="C02XL0GTJGH5" />
      <FieldDescription>
        Printed on the back of the device.{" "}
        <a href="#serial-help">Find your serial number</a>
      </FieldDescription>
    </Field>
  )
}
