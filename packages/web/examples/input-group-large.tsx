import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export default function InputGroupLarge() {
  return (
    <InputGroup size="lg" className="w-96">
      <InputGroupAddon>
        <InputGroupText className="text-foreground">+90</InputGroupText>
        <span aria-hidden="true" className="ms-1 me-1.5 h-5.5 w-px bg-border" />
      </InputGroupAddon>
      <InputGroupInput
        type="tel"
        aria-label="Phone number"
        placeholder="555 123 45 67"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" size="icon" aria-label="Continue">
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
