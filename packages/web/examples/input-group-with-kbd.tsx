import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

export default function InputGroupWithKbd() {
  return (
    <InputGroup className="w-96">
      <InputGroupInput placeholder="Search documentation..." />
      <InputGroupAddon>
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="Search01Icon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd mod>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
