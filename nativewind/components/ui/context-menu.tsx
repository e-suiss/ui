import { cn } from "cn"
import { CaretRightIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, Text, View } from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ContextMenuPrimitive from "@/components/primitives/context-menu"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.SubmenuRoot

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

type PositionerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Positioner
>

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 0,
  portalHost,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  return (
    <ContextMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ContextMenuPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
            <TextClassContext.Provider value="text-base text-label">
              <ContextMenuPrimitive.Popup
                className={(state) =>
                  cn(
                    "min-w-48 rounded-xl border border-label-5 bg-surface-raised p-1.5 shadow-lg dark:border-label-10",
                    resolveClassName(className, state)
                  )
                }
                {...props}
              />
            </TextClassContext.Provider>
          </AnimatedView>
        </ContextMenuPrimitive.Positioner>
      </FullWindowOverlay>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger> & {
  children?: React.ReactNode
  iconClassName?: string
  inset?: boolean
}) {
  const { open } = ContextMenuPrimitive.useMenuRootContext().floating
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-base text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <ContextMenuPrimitive.SubmenuTrigger
        className={(state) =>
          cn(
            "group flex-row items-center gap-2 rounded-md px-3 py-2",
            state.highlighted && "bg-item-pressed",
            state.open && !state.highlighted && "bg-item-selected",
            state.open && "mb-1",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {children}
        <View className={cn("ml-auto shrink-0", open && "rotate-90")}>
          <Icon as={CaretRightIcon} className={cn("size-4", iconClassName)} />
        </View>
      </ContextMenuPrimitive.SubmenuTrigger>
    </TextClassContext.Provider>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup>) {
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.Popup
        className={(state) =>
          cn(
            "min-w-36 rounded-xl border border-label-5 bg-surface-raised p-1.5 shadow-lg dark:border-label-10",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </AnimatedView>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const destructive = variant === "destructive"
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-base text-label",
        destructive && "text-danger",
        props.disabled && "text-label-quaternary"
      )}
    >
      <ContextMenuPrimitive.Item
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-md px-3 py-2",
            state.highlighted &&
              (destructive ? "bg-danger-surface-pressed" : "bg-item-pressed"),
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-base text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <ContextMenuPrimitive.CheckboxItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-md py-2 pr-8 pl-3",
            state.highlighted && "bg-item-pressed",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <ContextMenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} className="size-4" />
          </ContextMenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-base text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <ContextMenuPrimitive.RadioItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-md py-2 pr-8 pl-3",
            state.highlighted && "bg-item-pressed",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <ContextMenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} className="size-4" />
          </ContextMenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      className={(state) =>
        cn(
          "px-3 py-2.5 text-xs font-semibold text-label-secondary",
          inset && "pl-[2.375rem]",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={(state) =>
        cn(
          "-mx-1.5 my-1.5 h-px bg-separator-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("ml-auto text-xs text-label-secondary", className)}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
