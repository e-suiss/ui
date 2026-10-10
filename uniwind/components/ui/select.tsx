import * as SelectPrimitive from "@rn-primitives/select"
import { cn } from "cn"
import { CaretDownIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, StyleSheet, View } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

type Option = SelectPrimitive.Option

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

function SelectValue({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
  className?: string
}) {
  const { value } = SelectPrimitive.useRootContext()
  return (
    <SelectPrimitive.Value
      ref={ref}
      className={cn(
        "line-clamp-1 flex flex-row items-center gap-1.5 text-sm text-foreground",
        !value && "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SelectTrigger({
  ref,
  className,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
}) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "h-9 flex-row items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2",
        props.disabled && "opacity-50",
        size === "sm" && "h-8",
        className
      )}
      {...props}
    >
      {children}
      <Icon
        as={CaretDownIcon}
        aria-hidden={true}
        className="size-4 text-muted-foreground"
      />
    </SelectPrimitive.Trigger>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function SelectContent({
  className,
  children,
  position = "popper",
  portalHost,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  className?: string
  portalHost?: string
}) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
          <AnimatedView
            className="z-50"
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-sm text-popover-foreground">
              <SelectPrimitive.Content
                className={cn(
                  "relative z-50 min-w-36 rounded-3xl border border-foreground/5 bg-popover shadow-lg dark:border-foreground/10",
                  position === "popper" && undefined,
                  className
                )}
                position={position}
                {...props}
              >
                <SelectPrimitive.Viewport
                  className={cn("p-1.5", position === "popper" && "w-full")}
                >
                  {children}
                </SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </TextClassContext.Provider>
          </AnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children">) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative w-full flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 active:bg-accent",
        props.disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View className="absolute right-2 size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon as={CheckIcon} className="size-4 shrink-0 text-foreground" />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="select-none text-sm font-medium text-foreground" />
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
