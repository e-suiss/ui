import { CopyIcon, PaperclipIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupButtonSizes() {
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput placeholder="Type a command..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs">Extra small</InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Copy">
            <CopyIcon />
          </InputGroupButton>
          <InputGroupButton size="icon-sm" aria-label="Attach">
            <PaperclipIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
