import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
  { value: "push", label: "Push notification" },
]

export default function RadioGroupDisabled() {
  return (
    <div className="w-64">
      <RadioGroup
        aria-label="Notification method"
        defaultValue="email"
        isDisabled
      >
        {options.map((option) => (
          <Label key={option.value}>
            <RadioGroupItem value={option.value} />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
