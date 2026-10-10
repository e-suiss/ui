import * as React from "react"
import { type PressableStateCallbackType, StyleSheet } from "react-native"
import * as ToggleGroupPrimitive from "@/components/primitives/toggle-group"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { useTheme } from "@/components/ui/theme"
import {
  type ToggleVariantProps,
  toggleStyle,
  toggleTextStyle,
} from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<ToggleVariantProps | null>(null)

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  item: { flexShrink: 0 },
  icon: { flexShrink: 0 },
})

function ToggleGroup({
  style,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  ToggleVariantProps) {
  return (
    <ToggleGroupPrimitive.Root style={[styles.root, style]} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext)
  if (context === null) {
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component"
    )
  }
  return context
}

function ToggleGroupItem({
  style,
  children,
  variant,
  size,
  isFirst,
  isLast,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  ToggleVariantProps & {
    isFirst?: boolean
    isLast?: boolean
  }) {
  const context = useToggleGroupContext()
  const { value } = ToggleGroupPrimitive.useRootContext()
  const { colors } = useTheme()

  return (
    <TextStyleContext.Provider value={toggleTextStyle(colors)}>
      <ToggleGroupPrimitive.Item
        style={(state: PressableStateCallbackType) => [
          toggleStyle(
            {
              variant: context.variant || variant,
              size: context.size || size,
            },
            colors,
            {
              pressed: state.pressed,
              selected: ToggleGroupPrimitive.utils.getIsSelected(
                value,
                props.value
              ),
              disabled: props.disabled,
            }
          ),
          styles.item,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    </TextStyleContext.Provider>
  )
}

function ToggleGroupIcon({
  style,
  size = 16,
  ...props
}: React.ComponentProps<typeof Icon>) {
  return <Icon size={size} style={[styles.icon, style]} {...props} />
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem }
