import { Textarea } from "@/components/ui/textarea"

export default function TextareaLarge() {
  return (
    <Textarea
      size="lg"
      aria-label="Message"
      placeholder="Write a message..."
      className="w-96"
    />
  )
}
