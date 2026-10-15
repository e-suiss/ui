import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxWithDescription() {
  return (
    <div className="flex w-80 items-start gap-3">
      <Checkbox
        id="marketing"
        aria-describedby="marketing-description"
        defaultChecked
        className="mt-0.75"
      />
      <div className="grid gap-1.5">
        <Label htmlFor="marketing">Product updates</Label>
        <p id="marketing-description" className="text-label-secondary text-sm">
          Get an email when we release new features.
        </p>
      </div>
    </div>
  )
}
