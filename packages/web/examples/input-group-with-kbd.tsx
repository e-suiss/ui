import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

export default function InputGroupWithKbd() {
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput placeholder="Search documentation..." />
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd mod>K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
