import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithInput() {
  return (
    <ButtonGroup orientation="horizontal">
      <Input aria-label="Search" placeholder="Search..." />
      <Button variant="secondary" size="icon-lg" aria-label="Search">
        <MagnifyingGlassIcon />
      </Button>
    </ButtonGroup>
  )
}
