import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithValue() {
  return (
    <div className="w-80">
      <Textarea
        placeholder="Type your message here."
        defaultValue="Thanks for the quick turnaround. The new layout looks great on mobile."
      />
    </div>
  )
}
