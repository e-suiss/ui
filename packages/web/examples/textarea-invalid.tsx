import { Textarea } from "@/components/ui/textarea"

export default function TextareaInvalid() {
  return (
    <Textarea
      className="w-80"
      placeholder="Type your message here."
      aria-invalid
      defaultValue="Too short"
    />
  )
}
