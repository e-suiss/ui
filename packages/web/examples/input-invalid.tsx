import { Input } from "@/components/ui/input"

export default function InputInvalid() {
  return (
    <div className="w-80">
      <Input
        type="email"
        placeholder="Enter your name"
        defaultValue="jane@"
        aria-invalid
      />
    </div>
  )
}
