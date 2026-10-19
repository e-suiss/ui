import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

export function NotFound() {
  return (
    <Card>
      <CardContent>
        <Empty className="p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlaceholder
                phosphor="BinocularsIcon"
                lucide="TelescopeIcon"
                tabler="IconTelescope"
                hugeicons="Telescope01Icon"
                remixicon="RiBinocularsLine"
              />
            </EmptyMedia>
            <EmptyTitle>Page not found</EmptyTitle>
            <EmptyDescription>
              The page you are looking for moved or never existed. Try a search
              instead.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InputGroup>
              <InputGroupInput
                placeholder="Search pages..."
                aria-label="Search pages"
              />
              <InputGroupAddon>
                <IconPlaceholder
                  phosphor="MagnifyingGlassIcon"
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="Search01Icon"
                  remixicon="RiSearchLine"
                />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <Button variant="outline">
              <IconPlaceholder
                phosphor="ArrowLeftIcon"
                lucide="ArrowLeftIcon"
                tabler="IconArrowLeft"
                hugeicons="ArrowLeft02Icon"
                remixicon="RiArrowLeftLine"
                data-icon="inline-start"
              />
              Back to home
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
