import { Input } from "@/components/ui/input"

export default function InputTypes() {
  return (
    <div className="w-80">
      <div className="flex flex-col gap-3">
        <Input type="email" placeholder="jane@example.com" />
        <Input type="password" placeholder="Password" />
        <Input type="number" placeholder="Quantity" />
        <Input type="search" placeholder="Search..." />
      </div>
    </div>
  )
}
