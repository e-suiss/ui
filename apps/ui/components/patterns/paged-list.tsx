"use client"

import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useIsMobile } from "@/hooks/use-mobile"

function pageRange(page: number, pageCount: number) {
  const pages: (number | "ellipsis")[] = []
  for (let current = 1; current <= pageCount; current++) {
    const edge = current === 1 || current === pageCount
    const near = Math.abs(current - page) <= 1
    if (edge || near) {
      pages.push(current)
    } else if (pages.at(-1) !== "ellipsis") {
      pages.push("ellipsis")
    }
  }
  return pages
}

function PagedList<T>({
  items,
  pageSize = 10,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  getPageHref,
  getKey = (_, index) => index,
  renderItem,
  loadMoreLabel = "Load more",
  previousLabel,
  nextLabel,
  className,
  listClassName,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  items: T[]
  pageSize?: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  getPageHref?: (page: number) => string
  getKey?: (item: T, index: number) => React.Key
  renderItem: (item: T, index: number) => React.ReactNode
  loadMoreLabel?: string
  previousLabel?: string
  nextLabel?: string
  listClassName?: string
}) {
  const isMobile = useIsMobile()
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const [uncontrolledPage, setUncontrolledPage] = React.useState(defaultPage)
  const page = Math.min(Math.max(pageProp ?? uncontrolledPage, 1), pageCount)
  const [loaded, setLoaded] = React.useState(1)
  const listRef = React.useRef<HTMLUListElement>(null)
  const focusIndexRef = React.useRef<number | null>(null)

  const setPage = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return
    if (pageProp === undefined) setUncontrolledPage(next)
    onPageChange?.(next)
    listRef.current?.scrollIntoView({ block: "nearest" })
  }

  const loadMore = () => {
    focusIndexRef.current = loaded * pageSize
    setLoaded((current) => Math.min(current + 1, pageCount))
  }

  React.useEffect(() => {
    const index = focusIndexRef.current
    if (index === null) return
    focusIndexRef.current = null
    listRef.current?.children[index]
      ?.querySelector<HTMLElement>("a, button, [tabindex]")
      ?.focus()
  })

  const start = isMobile ? 0 : (page - 1) * pageSize
  const end = isMobile ? loaded * pageSize : page * pageSize
  const visible = items.slice(start, end)

  const link = (target: number) => ({
    href: getPageHref?.(target) ?? "#",
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!getPageHref) event.preventDefault()
      setPage(target)
    },
  })

  return (
    <div
      data-slot="paged-list"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <ul
        ref={listRef}
        data-slot="paged-list-items"
        className={cn("flex flex-col", listClassName)}
      >
        {visible.map((item, offset) => (
          <li key={getKey(item, start + offset)} data-slot="paged-list-item">
            {renderItem(item, start + offset)}
          </li>
        ))}
      </ul>
      {isMobile
        ? end < items.length && (
            <Button
              data-slot="paged-list-load-more"
              variant="secondary"
              size="lg"
              block
              onClick={loadMore}
            >
              {loadMoreLabel}
            </Button>
          )
        : pageCount > 1 && (
            <Pagination data-slot="paged-list-pagination">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text={previousLabel}
                    aria-disabled={page === 1 || undefined}
                    {...link(page - 1)}
                  />
                </PaginationItem>
                {pageRange(page, pageCount).map((entry, index, pages) =>
                  entry === "ellipsis" ? (
                    <PaginationItem key={`after-${pages[index - 1]}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={entry}>
                      <PaginationLink
                        isActive={entry === page}
                        {...link(entry)}
                      >
                        {entry}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    text={nextLabel}
                    aria-disabled={page === pageCount || undefined}
                    {...link(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
    </div>
  )
}

export { PagedList }
