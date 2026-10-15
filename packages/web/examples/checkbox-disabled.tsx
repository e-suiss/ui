import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Checkbox disabled />
        Unavailable option
      </Label>
      <Label>
        <Checkbox disabled defaultChecked />
        Always included
      </Label>
    </div>
  )
}
