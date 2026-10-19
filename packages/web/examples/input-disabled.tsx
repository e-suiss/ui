import { Input } from "@/components/ui/input"

export default function InputDisabled() {
  return (
    <Input
      type="text"
      placeholder="Enter your name"
      disabled
      className="w-80"
    />
  )
}
