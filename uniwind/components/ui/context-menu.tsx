import * as ContextMenuPrimitive from "@rn-primitives/context-menu"
import { cn } from "cn"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  children?: React.ReactNode
  iconClassName?: string
  inset?: boolean
}) {
  const { open } = ContextMenuPrimitive.useSubContext()
  const icon = open ? CaretUpIcon : CaretDownIcon
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm font-medium text-popover-foreground",
        open && "text-accent-foreground"
      )}
    >
      <ContextMenuPrimitive.SubTrigger
        className={cn(
          "group flex-row items-center gap-2 rounded-2xl px-3 py-2 active:bg-accent",
          className,
          open && cn("bg-accent", "mb-1"),
          inset && "pl-9.5"
        )}
        {...props}
      >
        {children}
        <Icon
          as={icon}
          className={cn(
            "ml-auto size-4 shrink-0 text-foreground",
            iconClassName
          )}
        />
      </ContextMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.SubContent
        className={cn(
          "min-w-36 rounded-3xl border border-foreground/5 bg-popover p-1.5 shadow-lg dark:border-foreground/10",
          className
        )}
        {...props}
      />
    </AnimatedView>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function ContextMenuContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>
  overlayClassName?: string
  portalHost?: string
}) {
  return (
    <ContextMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ContextMenuPrimitive.Overlay
          style={
            overlayStyle
              ? StyleSheet.flatten([
                  StyleSheet.absoluteFill,
                  overlayStyle as typeof StyleSheet.absoluteFill,
                ])
              : StyleSheet.absoluteFill
          }
          className={overlayClassName}
          asChild
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-sm text-popover-foreground">
              <ContextMenuPrimitive.Content
                className={cn(
                  "min-w-48 rounded-3xl border border-foreground/5 bg-popover p-1.5 shadow-lg dark:border-foreground/10",
                  className
                )}
                {...props}
              />
            </TextClassContext.Provider>
          </AnimatedView>
        </ContextMenuPrimitive.Overlay>
      </FullWindowOverlay>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  className?: string
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm font-medium text-popover-foreground",
        variant === "destructive" && "text-destructive"
      )}
    >
      <ContextMenuPrimitive.Item
        className={cn(
          "group relative flex-row items-center gap-2.5 rounded-2xl px-3 py-2 active:bg-accent",
          variant === "destructive" &&
            "active:bg-destructive/10 dark:active:bg-destructive/20",
          props.disabled && "opacity-50",
          inset && "pl-9.5",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
}) {
  return (
    <TextClassContext.Provider value="select-none text-sm font-medium text-popover-foreground">
      <ContextMenuPrimitive.CheckboxItem
        className={cn(
          "group relative flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 active:bg-accent",
          props.disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <ContextMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} className="size-4 text-foreground" />
          </ContextMenuPrimitive.ItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  children?: React.ReactNode
}) {
  return (
    <TextClassContext.Provider value="select-none text-sm font-medium text-popover-foreground">
      <ContextMenuPrimitive.RadioItem
        className={cn(
          "group relative flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 active:bg-accent",
          props.disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <ContextMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} className="size-4 text-foreground" />
          </ContextMenuPrimitive.ItemIndicator>
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  className?: string
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "px-3 py-2.5 text-xs text-muted-foreground",
        inset && "pl-9.5",
        className
      )}
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
      className={cn("-mx-1.5 my-1.5 h-px bg-border/50", className)}
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
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
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
