import { cn } from "cn"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, Text, View } from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as MenuPrimitive from "@/components/primitives/menu"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const DropdownMenu = MenuPrimitive.Root

const DropdownMenuPortal = MenuPrimitive.Portal

const DropdownMenuTrigger = MenuPrimitive.Trigger

const DropdownMenuGroup = MenuPrimitive.Group

const DropdownMenuSub = MenuPrimitive.SubmenuRoot

const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

type PositionerProps = React.ComponentProps<typeof MenuPrimitive.Positioner>

function DropdownMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  return (
    <MenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <MenuPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
            <TextClassContext.Provider value="text-sm text-popover-foreground">
              <MenuPrimitive.Popup
                className={(state) =>
                  cn(
                    "min-w-48 rounded-3xl border border-foreground-5 bg-popover p-1.5 shadow-lg dark:border-foreground-10",
                    resolveClassName(className, state)
                  )
                }
                {...props}
              />
            </TextClassContext.Provider>
          </AnimatedView>
        </MenuPrimitive.Positioner>
      </FullWindowOverlay>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger> & {
  children?: React.ReactNode
  iconClassName?: string
  inset?: boolean
}) {
  const { open } = MenuPrimitive.useMenuRootContext().floating
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm font-medium text-popover-foreground",
        open && "text-accent-foreground"
      )}
    >
      <MenuPrimitive.SubmenuTrigger
        className={(state) =>
          cn(
            "group flex-row items-center gap-2 rounded-2xl px-3 py-2",
            (state.highlighted || state.open) && "bg-accent",
            state.disabled && "opacity-50",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {children}
        <Icon
          as={open ? CaretUpIcon : CaretDownIcon}
          className={cn(
            "ml-auto size-4 shrink-0 text-foreground",
            iconClassName
          )}
        />
      </MenuPrimitive.SubmenuTrigger>
    </TextClassContext.Provider>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenuPrimitive.Popup
        className={(state) =>
          cn(
            "min-w-36 rounded-3xl border border-foreground-5 bg-popover p-1.5 shadow-lg dark:border-foreground-10",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </AnimatedView>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const destructive = variant === "destructive"
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm font-medium text-popover-foreground",
        destructive && "text-destructive"
      )}
    >
      <MenuPrimitive.Item
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-2xl px-3 py-2",
            state.highlighted &&
              (destructive
                ? "bg-destructive-10 dark:bg-destructive-20"
                : "bg-accent"),
            state.disabled && "opacity-50",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  return (
    <TextClassContext.Provider value="select-none text-sm font-medium text-popover-foreground">
      <MenuPrimitive.CheckboxItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3",
            state.highlighted && "bg-accent",
            state.disabled && "opacity-50",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <MenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} className="size-4 text-foreground" />
          </MenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </MenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  return (
    <TextClassContext.Provider value="select-none text-sm font-medium text-popover-foreground">
      <MenuPrimitive.RadioItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3",
            state.highlighted && "bg-accent",
            state.disabled && "opacity-50",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute right-2 size-4 items-center justify-center">
          <MenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} className="size-4 text-foreground" />
          </MenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </MenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      className={(state) =>
        cn(
          "px-3 py-2.5 text-xs text-muted-foreground",
          inset && "pl-[2.375rem]",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      className={(state) =>
        cn(
          "-mx-1.5 my-1.5 h-px bg-border-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DropdownMenuShortcut({
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
