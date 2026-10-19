import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupWithDescriptions() {
  return (
    <RadioGroup
      className="w-64"
      aria-label="Shipping speed"
      defaultValue="standard"
    >
      <Label className="items-start">
        <RadioGroupItem
          value="standard"
          aria-labelledby="standard-label"
          aria-describedby="standard-description"
        />
        <span className="flex flex-col gap-1">
          <span id="standard-label">Standard</span>
          <span
            id="standard-description"
            className="text-muted-foreground font-normal"
          >
            Arrives in 4 to 6 business days.
          </span>
        </span>
      </Label>
      <Label className="items-start">
        <RadioGroupItem
          value="express"
          aria-labelledby="express-label"
          aria-describedby="express-description"
        />
        <span className="flex flex-col gap-1">
          <span id="express-label">Express</span>
          <span
            id="express-description"
            className="text-muted-foreground font-normal"
          >
            Arrives in 1 to 2 business days.
          </span>
        </span>
      </Label>
    </RadioGroup>
  )
}
