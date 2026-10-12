import { CheckIcon, MinusIcon } from "phosphor-react-native"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import * as CheckboxPrimitive from "@/components/primitives/checkbox"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { shadow, type ThemeColors, useTheme } from "@/components/ui/theme"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

const styles = StyleSheet.create({
  root: {
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  indicator: { alignItems: "center", justifyContent: "center" },
})

type SelectionState = {
  checked: boolean
  disabled: boolean
}

function selectionControlStyle(
  colors: ThemeColors,
  isDark: boolean,
  state: SelectionState,
  pressed: boolean,
  invalid: boolean | undefined
): ViewStyle {
  if (state.checked) {
    if (state.disabled) {
      return {
        borderColor: "transparent",
        backgroundColor: colors.accentDisabled,
      }
    }
    const color = pressed ? colors.accentPressed : colors.accent
    return { borderColor: color, backgroundColor: color }
  }
  if (state.disabled) {
    return {
      borderColor: isDark ? "transparent" : `${colors.label}1a`,
      backgroundColor: colors.controlDisabled,
    }
  }
  return {
    borderColor: invalid
      ? colors.danger
      : isDark
        ? "transparent"
        : `${colors.label}40`,
    backgroundColor: isDark
      ? colors.labelQuaternary
      : pressed
        ? colors.control
        : colors.surface,
    ...(isDark ? null : shadow.xs),
  }
}

function CheckboxIcon({ iconStyle }: { iconStyle?: StyleProp<TextStyle> }) {
  const { colors } = useTheme()
  const { state } = CheckboxPrimitive.useRootContext()
  return (
    <TextStyleContext.Provider
      value={StyleSheet.flatten([{ color: colors.onAccent }, iconStyle])}
    >
      <Icon as={state.indeterminate ? MinusIcon : CheckIcon} size={14} />
    </TextStyleContext.Provider>
  )
}

function Checkbox({
  style,
  iconStyle,
  invalid,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  iconStyle?: StyleProp<TextStyle>
  invalid?: boolean
}) {
  const { colors, isDark } = useTheme()
  return (
    <CheckboxPrimitive.Root
      hitSlop={HIT_SLOP}
      {...props}
      render={(renderProps, state) => (
        <Pressable
          {...renderProps}
          style={({ pressed }) => [
            styles.root,
            selectionControlStyle(
              colors,
              isDark,
              {
                checked: state.checked || state.indeterminate,
                disabled: state.disabled,
              },
              pressed,
              invalid
            ),
            resolveStyle(style, state) as StyleProp<ViewStyle>,
          ]}
        />
      )}
    >
      <CheckboxPrimitive.Indicator style={styles.indicator}>
        <CheckboxIcon iconStyle={iconStyle} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
