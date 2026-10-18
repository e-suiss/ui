"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

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
    <div
      ref={rootRef}
      data-slot="message-scroller"
      className={cn(
        "cn-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
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
  React.useInsertionEffect(() => {
    controller.setPreserveScrollOnPrepend(preserveScrollOnPrepend)
  }, [controller, preserveScrollOnPrepend])
  useFrameThrottledResizeObserver(viewportElementRef, controller.handleResize)

  return (
    <div
      ref={viewportRef}
      data-slot="message-scroller-viewport"
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      className={cn(
        "cn-message-scroller-viewport size-full min-h-0 min-w-0 overscroll-contain contain-content data-pending-scroll:invisible",
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
  const {
    handleContentChange,
    handleResize,
    setContentElement,
    setSpacerElement,
  } = useMessageScrollerContext()
  const contentElementRef = React.useRef<HTMLDivElement>(null)
  const contentRef = useMergedRefs(contentElementRef, setContentElement, ref)
  useChildListObserver(contentElementRef, handleContentChange)
  useFrameThrottledResizeObserver(contentElementRef, handleResize)

  return (
    <div
      ref={contentRef}
      data-slot="message-scroller-content"
      role={role}
      aria-relevant={ariaRelevant}
      className={cn(
        "cn-message-scroller-content flex h-max min-h-full flex-col",
        className
      )}
      {...props}
    >
      {children}
      <div
        ref={setSpacerElement}
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
        "cn-message-scroller-item min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
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
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size"> & {
    render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
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

  const elementProps = {
    "data-slot": "message-scroller-button",
    "data-direction": direction,
    "data-variant": variant,
    "data-size": size,
    "data-active": active ? "true" : "false",
    inert: !active,
    className: cn(
      "border-border bg-background text-foreground hover:bg-[color-mix(in_oklab,var(--background),var(--foreground)_6%)] hover:text-foreground absolute inset-s-1/2 -translate-x-1/2 transition-[translate,scale,opacity] duration-200 data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
      className
    ),
    ...props,
  }

  if (render)
    return render({
      ...elementProps,
      type,
      disabled,
      tabIndex: active ? tabIndex : -1,
      onClick: handleClick,
      children,
    } as React.HTMLAttributes<HTMLElement>)

  return (
    <Button
      variant={variant}
      size={size}
      type={type === "submit" || type === "reset" ? type : "button"}
      isDisabled={disabled}
      excludeFromTabOrder={!active || tabIndex === -1}
      onClick={(event) =>
        handleClick(event as React.MouseEvent<HTMLButtonElement>)
      }
      {...(elementProps as Omit<
        React.ComponentProps<typeof Button>,
        "children" | "className"
      >)}
      className={elementProps.className}
    >
      {children ?? (
        <>
          <IconPlaceholder
            lucide="ArrowDownIcon"
            tabler="IconArrowDown"
            hugeicons="ArrowDown02Icon"
            phosphor="ArrowDownIcon"
            remixicon="RiArrowDownLine"
          />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </Button>
  )
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
