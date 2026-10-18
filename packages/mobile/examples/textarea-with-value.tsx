import { Textarea } from "@/components/ui/textarea"

export default function TextareaWithValue() {
  return (
    <Textarea
      placeholder="Type your message here."
      defaultValue="The quick brown fox jumps over the lazy dog. This text spans a few lines to show how the textarea handles longer content."
    />
  )
}
