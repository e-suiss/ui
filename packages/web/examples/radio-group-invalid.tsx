import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupInvalid() {
  return (
    <RadioGroup
      className="w-64"
      aria-label="Notification method"
      defaultValue={undefined}
    >
      <Label>
        <RadioGroupItem value="email" aria-invalid />
        Email
      </Label>
      <Label>
        <RadioGroupItem value="sms" aria-invalid />
        Text message
      </Label>
      <Label>
        <RadioGroupItem value="push" aria-invalid />
        Push notification
      </Label>
    </RadioGroup>
  )
}
