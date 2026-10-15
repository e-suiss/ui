import { ArrowUpIcon, PaperclipIcon } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export default function InputGroupWithTextarea() {
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupTextarea placeholder="Ask, search, or chat..." />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" aria-label="Attach file">
            <PaperclipIcon />
          </InputGroupButton>
          <InputGroupText className="ms-auto">52% used</InputGroupText>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            className="rounded-full"
            aria-label="Send"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
