import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox isDisabled />
        Unavailable option
      </Label>
      <Label>
        <Checkbox isDisabled defaultSelected />
        Always included
      </Label>
    </div>
  )
}
