import { Input } from "@/components/ui/input"

export default function InputWithValue() {
  return (
    <div className="w-80">
      <Input
        type="text"
        placeholder="Enter your name"
        defaultValue="Jane Doe"
      />
    </div>
  )
}
