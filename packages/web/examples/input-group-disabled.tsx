import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupDisabled() {
  return (
    <div className="w-96">
      <InputGroup data-disabled="true">
        <InputGroupInput placeholder="Search..." disabled />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
