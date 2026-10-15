import { InfoIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupInvalid() {
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput defaultValue="jane@" aria-label="Email" aria-invalid />
        <InputGroupAddon align="inline-end">
          <InfoIcon className="text-danger" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
