import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithInput() {
  return (
    <ButtonGroup orientation="horizontal">
      <Input aria-label="Search" placeholder="Search..." />
      <Button variant="secondary" size="icon-lg" aria-label="Search">
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="Search01Icon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      </Button>
    </ButtonGroup>
  )
}
