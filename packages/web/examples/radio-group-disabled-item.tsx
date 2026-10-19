import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDisabledItem() {
  return (
    <RadioGroup
      className="w-64"
      aria-label="Notification method"
      defaultValue="email"
    >
      <Label>
        <RadioGroupItem value="email" />
        Email
      </Label>
      <Label>
        <RadioGroupItem value="sms" />
        Text message
      </Label>
      <Label>
        <RadioGroupItem value="push" disabled />
        Push notification
      </Label>
    </RadioGroup>
  )
}
