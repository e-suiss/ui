import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupSplitButton() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button>Publish</Button>
      <ButtonGroupSeparator className="bg-primary-foreground/30" />
      <Button size="icon" aria-label="More options">
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
        />
      </Button>
    </ButtonGroup>
  )
}
