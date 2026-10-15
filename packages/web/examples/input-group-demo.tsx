import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupDemo() {
  return (
    <div className="w-96">
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
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
    </div>
  )
}
