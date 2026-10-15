import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Media controls">
      <Button variant="secondary" size="icon" aria-label="Zoom in">
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="secondary" size="icon" aria-label="Zoom out">
        <IconPlaceholder
          lucide="MinusIcon"
          tabler="IconMinus"
          hugeicons="MinusSignIcon"
          phosphor="MinusIcon"
          remixicon="RiSubtractLine"
        />
      </Button>
    </ButtonGroup>
  )
}
