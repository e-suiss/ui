import { Textarea } from "@/components/ui/textarea"

export default function TextareaDisabled() {
  return (
    <div className="w-80">
      <Textarea placeholder="Type your message here." disabled />
    </div>
  )
}
