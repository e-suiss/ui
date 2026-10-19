import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupButtonSizes() {
  return (
    <InputGroup className="w-96">
      <InputGroupInput placeholder="Type a command..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs">Extra small</InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Copy">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy01Icon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
          />
        </InputGroupButton>
        <InputGroupButton size="icon-sm" aria-label="Attach">
          <IconPlaceholder
            lucide="PaperclipIcon"
            tabler="IconPaperclip"
            hugeicons="AttachmentIcon"
            phosphor="PaperclipIcon"
            remixicon="RiAttachment2"
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
