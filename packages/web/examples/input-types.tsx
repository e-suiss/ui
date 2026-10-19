import { Input } from "@/components/ui/input"

export default function InputTypes() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Input type="email" placeholder="jane@example.com" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Quantity" />
      <Input type="search" placeholder="Search..." />
    </div>
  )
}
