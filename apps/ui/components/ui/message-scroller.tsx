"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { useRender } from "@base-ui/react/use-render"
import { ArrowDownIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollBar } from "@/components/ui/scroll-area"
import {
  MessageScrollerContext,
  type MessageScrollerOptions,
  type MessageScrollerScrollDirection,
  useChildListObserver,
  useFrameThrottledResizeObserver,
  useMergedRefs,
  useMessageScroller,
  useMessageScrollerCanScroll,
  useMessageScrollerContext,
  useMessageScrollerController,
  useMessageScrollerPendingScroll,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/hooks/use-message-scroller"

function MessageScrollerProvider({
  children,
  ...options
}: MessageScrollerOptions & { children?: React.ReactNode }) {
  const controller = useMessageScrollerController(options)
  return (
    <MessageScrollerContext.Provider value={controller}>
      {children}
    </MessageScrollerContext.Provider>
  )
}

function MessageScroller({
  className,
  ref,
  ...props
}: React.ComponentProps<"div">) {
  const { setRootElement } = useMessageScrollerContext()
  const isPendingScroll = useMessageScrollerPendingScroll()
  const rootRef = useMergedRefs(setRootElement, ref)

  return (
    <ScrollAreaPrimitive.Root
      ref={rootRef}
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
      data-pending-scroll={isPendingScroll ? "" : undefined}
    />
  )
}

function MessageScrollerViewport({
  className,
  preserveScrollOnPrepend = true,
  ref,
  role = "region",
  "aria-label": ariaLabel = "Messages",
  tabIndex = 0,
  onKeyDown,
  onScroll,
  onTouchMove,
  onWheel,
  ...props
}: React.ComponentProps<"div"> & { preserveScrollOnPrepend?: boolean }) {
  const controller = useMessageScrollerContext()
  const isPendingScroll = useMessageScrollerPendingScroll()
  const viewportElementRef = React.useRef<HTMLDivElement>(null)
  const viewportRef = useMergedRefs(
    viewportElementRef,
    controller.setViewportElement,
    ref
  )
  controller.preserveScrollOnPrepend = preserveScrollOnPrepend
  useFrameThrottledResizeObserver(viewportElementRef, controller.handleResize)

  return (
    <>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="message-scroller-viewport"
        role={role}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        className={cn(
          "size-full min-h-0 min-w-0 overscroll-contain contain-content outline-none focus-visible:focus-ring data-scrollable:scroll-fade-b data-pending-scroll:invisible",
          className
        )}
        onKeyDown={(event) => {
          controller.handleKeyboardScrollIntent(event.key)
          onKeyDown?.(event)
        }}
        onScroll={(event) => {
          controller.syncAfterScroll()
          onScroll?.(event)
        }}
        onTouchMove={(event) => {
          controller.handleUserScrollIntent()
          onTouchMove?.(event)
        }}
        onWheel={(event) => {
          controller.handleUserScrollIntent()
          onWheel?.(event)
        }}
        {...props}
        data-pending-scroll={isPendingScroll ? "" : undefined}
      />
      <ScrollBar className="transition-opacity duration-200 group-has-data-autoscrolling/message-scroller:opacity-0 data-vertical:my-2 data-vertical:me-1 data-vertical:h-auto" />
    </>
  )
}

function MessageScrollerContent({
  className,
  children,
  ref,
  role = "log",
  "aria-relevant": ariaRelevant = "additions",
  spacerClassName,
  ...props
}: React.ComponentProps<"div"> & { spacerClassName?: string }) {
  const controller = useMessageScrollerContext()
  const contentElementRef = React.useRef<HTMLDivElement>(null)
  const contentRef = useMergedRefs(
    contentElementRef,
    controller.setContentElement,
    ref
  )
  useChildListObserver(contentElementRef, controller.handleContentChange)
  useFrameThrottledResizeObserver(contentElementRef, controller.handleResize)

  return (
    <div
      ref={contentRef}
      data-slot="message-scroller-content"
      role={role}
      aria-relevant={ariaRelevant}
      className={cn("flex h-max min-h-full flex-col gap-8", className)}
      {...props}
    >
      {children}
      <div
        ref={controller.setSpacerElement}
        aria-hidden="true"
        data-message-scroller-spacer=""
        hidden
        className={spacerClassName}
      />
    </div>
  )
}

function MessageScrollerItem({
  className,
  messageId,
  scrollAnchor = false,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  messageId?: string
  scrollAnchor?: boolean
}) {
  const { registerMessage } = useMessageScrollerContext()
  const itemElementRef = React.useRef<HTMLDivElement | null>(null)
  const registerItemElement = React.useCallback(
    (element: HTMLDivElement | null) => {
      const previousElement = itemElementRef.current
      itemElementRef.current = element
      if (messageId) registerMessage(messageId, element, previousElement)
    },
    [messageId, registerMessage]
  )
  const itemRef = useMergedRefs(registerItemElement, ref)

  return (
    <div
      ref={itemRef}
      data-slot="message-scroller-item"
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor ? "true" : "false"}
      className={cn(
        "min-w-0 shrink-0 px-2.5 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
}

type MessageScrollerButtonState = {
  active: boolean
  direction: MessageScrollerScrollDirection
}

function MessageScrollerButton({
  direction = "end",
  behavior = "smooth",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  type = "button",
  tabIndex,
  onClick,
  ...props
}: useRender.ComponentProps<"button", MessageScrollerButtonState> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size"> & {
    behavior?: ScrollBehavior
    direction?: MessageScrollerScrollDirection
  }) {
  const { scrollToEnd, scrollToStart } = useMessageScroller()
  const active = useMessageScrollerCanScroll(direction)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!active) return
    onClick?.(event)
    if (event.defaultPrevented) return
    event.currentTarget.blur()
    if (direction === "start") scrollToStart({ behavior })
    else scrollToEnd({ behavior })
  }

  const dataAttributes = {
    "data-slot": "message-scroller-button",
    "data-direction": direction,
    "data-variant": variant,
    "data-size": size,
  }

  return useRender({
    defaultTagName: "button",
    render: render ?? <Button variant={variant} size={size} />,
    state: { active, direction },
    stateAttributesMapping: {
      active: (isActive) => ({ "data-active": isActive ? "true" : "false" }),
    },
    props: mergeProps<"button">(
      {
        ...dataAttributes,
        type,
        inert: !active,
        tabIndex: active ? tabIndex : -1,
        onClick: handleClick,
        className: cn(
          "border-separator bg-surface text-label hover:bg-[color-mix(in_oklab,var(--surface),var(--label)_6%)] hover:text-label active:bg-[color-mix(in_oklab,var(--surface),var(--label)_10%)] absolute inset-s-1/2 -translate-x-1/2 transition-[translate,scale,opacity] duration-200 data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
          className
        ),
        children: children ?? (
          <>
            <ArrowDownIcon />
            <span className="sr-only">
              {direction === "end" ? "Scroll to end" : "Scroll to start"}
            </span>
          </>
        ),
      },
      props
    ),
  })
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
