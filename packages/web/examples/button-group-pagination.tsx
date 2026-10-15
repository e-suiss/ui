import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupPagination() {
  return (
    <ButtonGroup orientation="horizontal" aria-label="Pagination">
      <Button variant="outline" size="icon" aria-label="Previous page">
        <CaretLeftIcon />
      </Button>
      <Button variant="outline">1</Button>
      <Button variant="outline" aria-current="page">
        2
      </Button>
      <Button variant="outline">3</Button>
      <Button variant="outline" size="icon" aria-label="Next page">
        <CaretRightIcon />
      </Button>
    </ButtonGroup>
  )
}
