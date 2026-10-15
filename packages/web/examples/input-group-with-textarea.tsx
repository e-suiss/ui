import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
            <IconPlaceholder
              lucide="PaperclipIcon"
              tabler="IconPaperclip"
              hugeicons="AttachmentIcon"
              phosphor="PaperclipIcon"
              remixicon="RiAttachment2"
            />
          </InputGroupButton>
          <InputGroupText className="ms-auto">52% used</InputGroupText>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            className="rounded-full"
            aria-label="Send"
          >
            <IconPlaceholder
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUp02Icon"
              phosphor="ArrowUpIcon"
              remixicon="RiArrowUpLine"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
