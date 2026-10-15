import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Media controls">
      <Button variant="secondary" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="secondary" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}
