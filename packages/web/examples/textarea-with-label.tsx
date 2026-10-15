import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithLabel() {
  return (
    <div className="w-80">
      <div className="flex flex-col gap-2">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" placeholder="Tell us what you think." />
      </div>
    </div>
  )
}
