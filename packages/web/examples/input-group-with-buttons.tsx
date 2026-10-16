import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
            defaultValue="https://example.com/invite/x7k2"
            aria-label="Invite link"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy">
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="Copy01Icon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
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
              <IconPlaceholder
                lucide="InfoIcon"
                tabler="IconInfoCircle"
                hugeicons="InformationCircleIcon"
                phosphor="InfoIcon"
                remixicon="RiInformationLine"
              />
            </InputGroupButton>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="text-green-600"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
