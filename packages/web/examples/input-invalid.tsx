import { Input } from "@/components/ui/input"

export default function InputInvalid() {
  return (
    <Input
      type="email"
      placeholder="Enter your name"
      defaultValue="jane@"
      aria-invalid
      className="w-80"
    />
  )
}
