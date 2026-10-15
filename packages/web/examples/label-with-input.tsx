import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelWithInput() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="label-email">Email address</Label>
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  )
}
