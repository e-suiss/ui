import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithValue() {
  return (
    <Textarea
      className="w-80"
      placeholder="Type your message here."
      defaultValue="Thanks for the quick turnaround. The new layout looks great on mobile."
    />
  )
}
