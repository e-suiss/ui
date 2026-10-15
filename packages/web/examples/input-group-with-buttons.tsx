import { CheckIcon, CopyIcon, InfoIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupWithButtons() {
  return (
    <div className="w-96">
      <div className="flex flex-col gap-4">
        <InputGroup>
          <InputGroupInput
            defaultValue="https://esuiss.dev/invite/x7k2"
            aria-label="Invite link"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Enter your email" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Subscribe</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Username" defaultValue="janedoe" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Info">
              <InfoIcon />
            </InputGroupButton>
            <CheckIcon className="text-green-600" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
