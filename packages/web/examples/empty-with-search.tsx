import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function EmptyWithSearch() {
  return (
    <div className="w-[32rem]">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="sm:w-3/4">
            <InputGroupInput placeholder="Search pages..." />
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
          <EmptyDescription>
            Need help? <a href="#support">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}
