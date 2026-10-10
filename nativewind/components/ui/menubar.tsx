import { cn } from "cn"
import { CaretRightIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, Text, View } from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as MenuPrimitive from "@/components/primitives/menu"
import { Menubar as MenubarPrimitive } from "@/components/primitives/menubar"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const MenubarMenu = MenuPrimitive.Root

const MenubarPortal = MenuPrimitive.Portal

const MenubarGroup = MenuPrimitive.Group

const MenubarSub = MenuPrimitive.SubmenuRoot

const MenubarRadioGroup = MenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive>) {
  return (
    <MenubarPrimitive
      className={(state) =>
        cn(
          "h-9 flex-row items-center rounded-md border border-separator p-1",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <MenuPrimitive.Trigger
        className={(state) =>
          cn(
            "group flex-row items-center rounded-sm px-2 py-[0.1875rem] active:bg-item-pressed",
            state.open && "bg-item-selected",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

type PositionerProps = React.ComponentProps<typeof MenuPrimitive.Positioner>

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  side = "bottom",
  sideOffset = 8,
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
            <TextClassContext.Provider value="text-base text-label">
              <MenuPrimitive.Popup
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
        </MenuPrimitive.Positioner>
      </FullWindowOverlay>
    </MenuPrimitive.Portal>
  )
}

function MenubarSubTrigger({
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
        "select-none text-base text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <MenuPrimitive.SubmenuTrigger
        className={(state) =>
          cn(
            "group flex-row items-center gap-2 rounded-md px-3 py-2",
            state.highlighted && "bg-item-pressed",
            state.open && !state.highlighted && "bg-item-selected",
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
      </MenuPrimitive.SubmenuTrigger>
    </TextClassContext.Provider>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenuPrimitive.Popup
        className={(state) =>
          cn(
            "min-w-32 rounded-xl border border-label-5 bg-surface-raised p-1.5 shadow-lg dark:border-label-10",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </AnimatedView>
  )
}

function MenubarItem({
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
        "select-none text-base text-label",
        destructive && "text-danger",
        props.disabled && "text-label-quaternary"
      )}
    >
      <MenuPrimitive.Item
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

function MenubarCheckboxItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & {
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
      <MenuPrimitive.CheckboxItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-md py-2 pr-3 pl-[2.375rem]",
            state.highlighted && "bg-item-pressed",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute left-3 size-4 items-center justify-center">
          <MenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} className="size-4" />
          </MenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </MenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  )
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
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
      <MenuPrimitive.RadioItem
        className={(state) =>
          cn(
            "group relative flex-row items-center gap-2.5 rounded-md py-2 pr-3 pl-[2.375rem]",
            state.highlighted && "bg-item-pressed",
            inset && "pl-[2.375rem]",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <View className="absolute left-3 size-4 items-center justify-center">
          <MenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} className="size-4" />
          </MenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </MenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  )
}

function MenubarLabel({
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
          "px-3.5 py-2.5 text-xs font-semibold text-label-secondary",
          inset && "pl-[2.375rem]",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      className={(state) =>
        cn(
          "-mx-1 my-1 h-px bg-separator-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function MenubarShortcut({
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
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
