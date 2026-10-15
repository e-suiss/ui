import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxInvalid() {
  return (
    <Label>
      <Checkbox isInvalid />
      You must accept the terms
    </Label>
  )
}
