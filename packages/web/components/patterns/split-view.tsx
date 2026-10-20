"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type SplitViewColumn = "sidebar" | "list" | "detail"

type SplitViewContextProps = {
  isMobile: boolean
  column: SplitViewColumn
  setColumn: (column: SplitViewColumn) => void
  titles: Partial<Record<SplitViewColumn, React.ReactNode>>
}

const SplitViewContext = React.createContext<SplitViewContextProps | null>(null)

const SplitViewColumnContext = React.createContext<SplitViewColumn | null>(null)

function useSplitView() {
  const context = React.useContext(SplitViewContext)

  if (!context) {
    throw new Error("useSplitView must be used within a <SplitView />")
  }

  return context
}

const splitViewTitleVariants = cva("", {
  variants: {
    column: {
      sidebar: "px-3 pt-3 pb-2 text-xs font-semibold text-muted-foreground",
      list: "sr-only",
      detail: "pb-1 text-2xl font-semibold",
    },
  },
})

const NEXT: Record<SplitViewColumn, SplitViewColumn> = {
  sidebar: "list",
  list: "detail",
  detail: "detail",
}

const PREVIOUS: Record<SplitViewColumn, SplitViewColumn | null> = {
  sidebar: null,
  list: "sidebar",
  detail: "list",
}

const SCROLLABLE = /auto|scroll/

function scrollParent(element: HTMLElement) {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (SCROLLABLE.test(overflowY) && node.scrollHeight > node.clientHeight) {
      return node
    }
  }
  return null
}

function revealTop(element: HTMLElement) {
  const parent = scrollParent(element)
  const top = element.getBoundingClientRect().top
  if (parent) {
    const offset = top - parent.getBoundingClientRect().top
    if (offset < 0) parent.scrollTop += offset
  } else if (top < 0) {
    window.scrollBy({ top })
  }
}

function SplitView({
  column: columnProp,
  defaultColumn = "list",
  onColumnChange,
  className,
  children,
  ref: forwardedRef,
  ...props
}: React.ComponentProps<"div"> & {
  column?: SplitViewColumn
  defaultColumn?: SplitViewColumn
  onColumnChange?: (column: SplitViewColumn) => void
}) {
  const isMobile = useIsMobile()
  const [uncontrolledColumn, setUncontrolledColumn] =
    React.useState(defaultColumn)
  const column = columnProp ?? uncontrolledColumn
  const ref = React.useRef<HTMLDivElement>(null)
  const navigatedRef = React.useRef(false)

  const panes = React.Children.toArray(children).filter(React.isValidElement)
  const titles: SplitViewContextProps["titles"] = {}
  for (const pane of panes) {
    const kind = PANES.get(pane.type)
    if (kind) titles[kind] = (pane.props as { title?: React.ReactNode }).title
  }

  const setColumn = React.useCallback(
    (next: SplitViewColumn) => {
      navigatedRef.current = true
      if (columnProp === undefined) setUncontrolledColumn(next)
      onColumnChange?.(next)
    },
    [columnProp, onColumnChange]
  )

  React.useEffect(() => {
    if (!isMobile || !navigatedRef.current) return
    navigatedRef.current = false
    const pane = ref.current?.querySelector(`[data-slot=split-view-${column}]`)
    pane
      ?.querySelector<HTMLElement>("[data-split-view-heading]")
      ?.focus({ preventScroll: true })
    if (ref.current) revealTop(ref.current)
  }, [isMobile, column])

  const contextValue = { isMobile, column, setColumn, titles }

  if (isMobile) {
    return (
      <SplitViewContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            ref.current = node
            if (typeof forwardedRef === "function") return forwardedRef(node)
            if (forwardedRef) forwardedRef.current = node
          }}
          data-slot="split-view"
          data-column={column}
          className={cn("flex flex-col", className)}
          {...props}
        >
          {children}
        </div>
      </SplitViewContext.Provider>
    )
  }

  return (
    <SplitViewContext.Provider value={contextValue}>
      <div
        ref={(node) => {
          ref.current = node
          if (typeof forwardedRef === "function") return forwardedRef(node)
          if (forwardedRef) forwardedRef.current = node
        }}
        data-slot="split-view"
        className={cn("overflow-hidden rounded-2xl border", className)}
        {...props}
      >
        <ResizablePanelGroup orientation="horizontal">
          {panes.map((pane, index) => (
            <React.Fragment key={pane.key ?? index}>
              {index > 0 && <ResizableHandle />}
              {pane}
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    </SplitViewContext.Provider>
  )
}

function SplitViewPane({
  kind,
  title,
  defaultSize,
  minSize,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  kind: SplitViewColumn
  title?: React.ReactNode
  defaultSize: string
  minSize: string
}) {
  const { isMobile, column, setColumn, titles } = useSplitView()
  const titleId = React.useId()
  const previous = PREVIOUS[kind]
  const backColumn =
    previous === "sidebar" && titles.sidebar === undefined ? null : previous

  const content = (
    <section
      data-slot={`split-view-${kind}`}
      aria-labelledby={title ? titleId : undefined}
      className={cn("flex min-h-0 flex-col", className)}
      {...props}
    >
      {isMobile && backColumn && (
        <button
          type="button"
          data-slot="split-view-back"
          onClick={() => setColumn(backColumn)}
          className="-ms-1.5 inline-flex min-h-11 items-center gap-0.5 self-start rounded-md pe-1.5 text-base text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <IconPlaceholder
            lucide="ChevronLeftIcon"
            tabler="IconChevronLeft"
            hugeicons="ArrowLeft01Icon"
            phosphor="CaretLeftIcon"
            remixicon="RiArrowLeftSLine"
            className="size-4.5 shrink-0 rtl:rotate-180"
            aria-hidden
          />
          {titles[backColumn]}
        </button>
      )}
      {title && (
        <h2
          id={titleId}
          tabIndex={-1}
          data-split-view-heading=""
          className={cn(
            "outline-none",
            isMobile
              ? "pb-2 text-3xl font-bold tracking-tight"
              : splitViewTitleVariants({ column: kind })
          )}
        >
          {title}
        </h2>
      )}
      <SplitViewColumnContext.Provider value={kind}>
        {children}
      </SplitViewColumnContext.Provider>
    </section>
  )

  if (isMobile) return column === kind ? content : null

  return (
    <ResizablePanel
      data-slot={`split-view-${kind}-panel`}
      defaultSize={defaultSize}
      minSize={minSize}
      className="flex min-h-0 flex-col overflow-y-auto"
    >
      {content}
    </ResizablePanel>
  )
}

function SplitViewSidebar({
  className,
  ...props
}: React.ComponentProps<"section"> & { title?: React.ReactNode }) {
  return (
    <SplitViewPane
      kind="sidebar"
      defaultSize="20%"
      minSize="15%"
      className={cn("md:p-3 md:pt-1", className)}
      {...props}
    />
  )
}

function SplitViewList({
  className,
  ...props
}: React.ComponentProps<"section"> & { title?: React.ReactNode }) {
  return (
    <SplitViewPane
      kind="list"
      defaultSize="32%"
      minSize="22%"
      className={cn("md:p-3", className)}
      {...props}
    />
  )
}

function SplitViewDetail({
  className,
  ...props
}: React.ComponentProps<"section"> & { title?: React.ReactNode }) {
  return (
    <SplitViewPane
      kind="detail"
      defaultSize="48%"
      minSize="30%"
      className={cn("md:p-8", className)}
      {...props}
    />
  )
}

const PANES = new Map<unknown, SplitViewColumn>([
  [SplitViewSidebar, "sidebar"],
  [SplitViewList, "list"],
  [SplitViewDetail, "detail"],
])

function SplitViewItem({
  render,
  isActive = false,
  className,
  children,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
  }) {
  const { isMobile, setColumn } = useSplitView()
  const kind = React.useContext(SplitViewColumnContext) ?? "list"

  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-current": isActive ? "true" : undefined,
        onClick: () => setColumn(NEXT[kind]),
        className: cn(
          "flex w-full items-center gap-3 text-start text-base outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isMobile
            ? "min-h-11 border-border py-3 [[data-slot=split-view-item]+&]:border-t"
            : "rounded-lg px-3 py-2 hover:bg-accent data-active:bg-muted hover:text-accent-foreground",
          !isMobile && kind === "list" && "rounded-xl py-3",
          className
        ),
        children: (
          <>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              {children}
            </span>
            {isMobile && kind !== "detail" && (
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
                aria-hidden
              />
            )}
          </>
        ),
      },
      props
    ),
    state: {
      slot: "split-view-item",
      active: isActive,
    },
  })
}

export {
  SplitView,
  type SplitViewColumn,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
  useSplitView,
}
