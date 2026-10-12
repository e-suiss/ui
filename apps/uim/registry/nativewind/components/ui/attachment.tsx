import { cn } from "cn"
import * as React from "react"
import { Pressable, View, type ViewProps } from "react-native"
import * as ProgressPrimitive from "@/components/primitives/progress"
import type { RenderProp } from "@/components/primitives/types"
import { resolveClassName, useRender } from "@/components/primitives/use-render"
import { Button, buttonTextVariants } from "@/components/ui/button"
import { IconClassContext } from "@/components/ui/icon"
import {
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"
import { Text, TextClassContext } from "@/components/ui/text"

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"

type AttachmentSize = "default" | "sm" | "xs"

type AttachmentOrientation = "horizontal" | "vertical"

type AttachmentContextValue = {
  state: AttachmentState
  size: AttachmentSize
  orientation: AttachmentOrientation
  grouped: boolean
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: "done",
  size: "default",
  orientation: "horizontal",
  grouped: false,
})

const AttachmentGroupItemContext = React.createContext<number | null>(null)

const AttachmentContentContext = React.createContext(false)

const SIZE: Record<AttachmentSize, string> = {
  default: "gap-3 px-4 py-3",
  sm: "gap-2.5",
  xs: "gap-1.5",
}

const SIZE_WITH_CONTENT: Record<AttachmentSize, string> = {
  default: "px-2.5 py-2",
  sm: "px-2 py-1.5",
  xs: "px-1.5 py-1",
}

const SIZE_WITH_MEDIA: Record<AttachmentSize, string> = {
  default: "p-2",
  sm: "p-1.5",
  xs: "p-1",
}

const SEPARATOR_START: Record<AttachmentSize, [string, string]> = {
  default: ["start-4", "start-16"],
  sm: ["start-2", "start-12"],
  xs: ["start-1.5", "start-[2.375rem]"],
}

const MEDIA_SIZE: Record<AttachmentSize, string> = {
  default: "h-11 w-9",
  sm: "h-10 w-8",
  xs: "h-[2.125rem] w-7 rounded-sm",
}

const ACTION_SIZE: Record<AttachmentSize, [string, number]> = {
  default: ["size-7", 9],
  sm: ["size-6", 11],
  xs: ["size-5", 13],
}

function wrapText(children: React.ReactNode) {
  const output: React.ReactNode[] = []
  let run: (string | number)[] = []
  const flush = () => {
    if (run.length === 0) return
    output.push(<Text key={`text-${output.length}`}>{run.join("")}</Text>)
    run = []
  }
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(child)
    } else {
      flush()
      output.push(child)
    }
  }
  flush()
  return output
}

function containsType(children: React.ReactNode, type: unknown) {
  let found = false
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === type) found = true
  })
  return found
}

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  children,
  ...props
}: ViewProps & {
  state?: AttachmentState
  size?: AttachmentSize
  orientation?: AttachmentOrientation
}) {
  const groupIndex = React.useContext(AttachmentGroupItemContext)
  const grouped = groupIndex !== null
  const hasMedia = containsType(children, AttachmentMedia)
  const hasContent = containsType(children, AttachmentContent)
  const vertical = orientation === "vertical"
  const context = React.useMemo(
    () => ({ state, size, orientation, grouped }),
    [state, size, orientation, grouped]
  )
  return (
    <AttachmentContext.Provider value={context}>
      <TextClassContext.Provider
        value={cn("text-label", size === "default" ? "text-sm" : "text-xs")}
      >
        <View
          className={cn(
            "relative min-w-0 max-w-full shrink-0 rounded-2xl bg-surface-secondary",
            SIZE[size],
            size === "xs" && "rounded-lg",
            vertical
              ? cn("flex-col", hasContent ? "w-[7.5rem]" : "w-24")
              : "min-w-40 flex-row items-center",
            vertical && size === "default" && "gap-2",
            (vertical || size !== "default") &&
              (hasContent
                ? SIZE_WITH_CONTENT[size]
                : hasMedia && SIZE_WITH_MEDIA[size]),
            grouped ? "w-full rounded-none" : "self-start",
            !grouped &&
              state === "idle" &&
              "border border-dashed border-separator",
            className
          )}
          {...props}
        >
          {grouped && groupIndex > 0 ? (
            <View
              className={cn(
                "absolute end-0 top-0 h-px bg-separator",
                SEPARATOR_START[size][hasMedia ? 1 : 0]
              )}
            />
          ) : null}
          {children}
        </View>
      </TextClassContext.Provider>
    </AttachmentContext.Provider>
  )
}

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: ViewProps & { variant?: "icon" | "document" | "image" }) {
  const { size, orientation } = React.useContext(AttachmentContext)
  const vertical = orientation === "vertical"
  return (
    <IconClassContext.Provider
      value={cn(
        vertical ? "size-6" : size === "xs" ? "size-3.5" : "size-4",
        variant === "icon" && "text-label-secondary"
      )}
    >
      <View
        className={cn(
          "relative shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-secondary",
          MEDIA_SIZE[size],
          vertical && "w-full",
          variant !== "image" &&
            "rounded-sm border border-separator bg-surface",
          variant === "document" && "justify-end pb-1.5",
          vertical && variant !== "document" && "aspect-square h-auto",
          className
        )}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function AttachmentLabel({ className, children, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-[0.5625rem] leading-[0.6875rem] font-semibold uppercase text-on-accent">
      <View
        className={cn("rounded-xs bg-accent px-1 py-0.5", className)}
        {...props}
      >
        {wrapText(children)}
      </View>
    </TextClassContext.Provider>
  )
}

function AttachmentContent({ className, children, ...props }: ViewProps) {
  const { orientation } = React.useContext(AttachmentContext)
  const progress = containsType(children, AttachmentProgress)
  return (
    <AttachmentContentContext.Provider value={progress}>
      <View
        className={cn(
          "min-w-0 max-w-full",
          orientation === "vertical" ? "px-1" : "flex-1",
          className
        )}
        {...props}
      >
        {children}
      </View>
    </AttachmentContentContext.Provider>
  )
}

function AttachmentTitle({
  className,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { size } = React.useContext(AttachmentContext)
  const progress = React.useContext(AttachmentContentContext)
  return (
    <Text
      numberOfLines={numberOfLines}
      className={cn(
        "min-w-0 max-w-full",
        size === "default" ? "text-base" : "font-semibold",
        progress && "pe-12",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { size, state } = React.useContext(AttachmentContext)
  return (
    <Text
      numberOfLines={numberOfLines}
      className={cn(
        "mt-0.5 min-w-0 max-w-full text-label-secondary",
        size === "default" ? "text-sm" : "text-xs",
        state === "error" && "text-danger",
        className
      )}
      {...props}
    />
  )
}

function AttachmentProgress({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "children">) {
  return (
    <ProgressPrimitive.Root
      className={(state) =>
        cn("relative mt-2 w-full", resolveClassName(className, state))
      }
      {...props}
    >
      <ProgressValue className="absolute end-0 bottom-full mb-2 text-sm text-label-secondary" />
      <ProgressTrack className="h-1 rounded-full bg-label-10">
        <ProgressIndicator className="rounded-full bg-accent" />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function AttachmentActions({ className, ...props }: ViewProps) {
  const { orientation } = React.useContext(AttachmentContext)
  return (
    <View
      className={cn(
        "relative z-20 shrink-0 flex-row items-center",
        orientation === "vertical" && "absolute end-3 top-3 gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant = "secondary",
  size,
  hitSlop,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { size: attachmentSize, orientation } =
    React.useContext(AttachmentContext)
  const isText = variant === "link"
  const resolvedSize = size ?? (isText ? "sm" : "icon-xs")
  const [actionSize, slop] = ACTION_SIZE[attachmentSize]
  const vertical = orientation === "vertical"
  const disabled = Boolean(props.disabled)
  return (
    <Button
      variant={variant}
      size={resolvedSize}
      hitSlop={hitSlop ?? (isText ? undefined : slop)}
      className={cn(
        isText ? "h-auto px-0" : actionSize,
        !isText && vertical && "bg-scrim active:bg-scrim",
        className
      )}
      {...props}
    >
      <TextClassContext.Provider
        value={cn(
          buttonTextVariants({ variant, size: resolvedSize, disabled }),
          isText && "text-base",
          !isText && (vertical ? "text-on-accent" : "text-label-secondary")
        )}
      >
        <IconClassContext.Provider
          value={
            !isText && attachmentSize === "xs"
              ? "size-2.5"
              : resolvedSize === "xs" || resolvedSize === "icon-xs"
                ? "size-3"
                : "size-4"
          }
        >
          {wrapText(children as React.ReactNode)}
        </IconClassContext.Provider>
      </TextClassContext.Provider>
    </Button>
  )
}

function AttachmentTrigger({
  className,
  render,
  ...props
}: React.ComponentProps<typeof Pressable> &
  React.RefAttributes<View> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const { size, grouped } = React.useContext(AttachmentContext)
  return useRender({
    defaultComponent: Pressable,
    render,
    props: [
      {
        className: cn(
          "absolute inset-0 z-10 active:bg-item-pressed",
          grouped
            ? "rounded-none"
            : size === "xs"
              ? "rounded-lg"
              : "rounded-2xl",
          className
        ),
        role: "button",
      },
      props,
    ],
  })
}

function AttachmentGroup({ className, children, ...props }: ViewProps) {
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = index
    index += 1
    return (
      <AttachmentGroupItemContext.Provider value={value}>
        {child}
      </AttachmentGroupItemContext.Provider>
    )
  })
  return (
    <View
      className={cn(
        "w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-surface-secondary",
        className
      )}
      {...props}
    >
      {items}
    </View>
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
  AttachmentTrigger,
}
