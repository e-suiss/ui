import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationCustomLabels() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="Newer" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text="Older" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
