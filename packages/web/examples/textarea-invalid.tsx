import { Textarea } from "@/components/ui/textarea"

export default function TextareaInvalid() {
  return (
    <div className="w-80">
      <Textarea
        placeholder="Type your message here."
        aria-invalid
        defaultValue="Too short"
      />
    </div>
  )
}
