import { CaretDownIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupSplitButton() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button>Publish</Button>
      <ButtonGroupSeparator className="bg-on-accent/30" />
      <Button size="icon" aria-label="More options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  )
}
