import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelDisabled() {
  return (
    <div className="group flex w-72 flex-col gap-2" data-disabled="true">
      <Label htmlFor="label-disabled">Email address</Label>
      <Input
        id="label-disabled"
        type="email"
        placeholder="you@example.com"
        disabled
      />
    </div>
  )
}
