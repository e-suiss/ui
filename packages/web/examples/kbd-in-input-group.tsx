import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

export default function KbdInInputGroup() {
  return (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
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
    </div>
  )
}
