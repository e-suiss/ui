import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupPagination() {
  return (
    <ButtonGroup orientation="horizontal" aria-label="Pagination">
      <Button variant="outline" size="icon" aria-label="Previous page">
        <IconPlaceholder
          lucide="ChevronLeftIcon"
          tabler="IconChevronLeft"
          hugeicons="ArrowLeft01Icon"
          phosphor="CaretLeftIcon"
          remixicon="RiArrowLeftSLine"
        />
      </Button>
      <Button variant="outline">1</Button>
      <Button variant="outline" aria-current="page">
        2
      </Button>
      <Button variant="outline">3</Button>
      <Button variant="outline" size="icon" aria-label="Next page">
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
        />
      </Button>
    </ButtonGroup>
  )
}
