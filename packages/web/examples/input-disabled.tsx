import { Input } from "@/components/ui/input"

export default function InputDisabled() {
  return (
    <div className="w-80">
      <Input type="text" placeholder="Enter your name" disabled />
    </div>
  )
}
