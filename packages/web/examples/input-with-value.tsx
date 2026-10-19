import { Input } from "@/components/ui/input"

export default function InputWithValue() {
  return (
    <Input
      type="text"
      placeholder="Enter your name"
      defaultValue="Jane Doe"
      className="w-80"
    />
  )
}
