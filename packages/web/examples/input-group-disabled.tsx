import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupDisabled() {
  return (
    <div className="w-96">
      <InputGroup data-disabled="true">
        <InputGroupInput placeholder="Search..." disabled />
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
