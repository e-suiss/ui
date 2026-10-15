import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupWithDescriptions() {
  return (
    <div className="w-64">
      <RadioGroup aria-label="Shipping speed" defaultValue="standard">
        {[
          {
            value: "standard",
            label: "Standard",
            description: "Arrives in 4 to 6 business days.",
          },
          {
            value: "express",
            label: "Express",
            description: "Arrives in 1 to 2 business days.",
          },
        ].map((option) => (
          <Label key={option.value} className="items-start">
            <RadioGroupItem
              value={option.value}
              aria-labelledby={`${option.value}-label`}
              aria-describedby={`${option.value}-description`}
            />
            <span className="flex flex-col gap-1">
              <span id={`${option.value}-label`}>{option.label}</span>
              <span
                id={`${option.value}-description`}
                className="text-muted-foreground font-normal"
              >
                {option.description}
              </span>
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
