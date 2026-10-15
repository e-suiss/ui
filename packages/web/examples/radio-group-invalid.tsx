import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
  { value: "push", label: "Push notification" },
]

export default function RadioGroupInvalid() {
  return (
    <div className="w-64">
      <RadioGroup aria-label="Notification method" defaultValue={undefined}>
        {options.map((option) => (
          <Label key={option.value}>
            <RadioGroupItem value={option.value} aria-invalid />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
