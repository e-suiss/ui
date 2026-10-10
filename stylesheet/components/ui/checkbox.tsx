import * as CheckboxPrimitive from "@rn-primitives/checkbox"
import { CheckIcon } from "phosphor-react-native"
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { useTheme } from "@/components/ui/theme"

const DEFAULT_HIT_SLOP = 24

const styles = StyleSheet.create({
  root: {
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
  },
  indicator: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.5 },
})

function Checkbox({
  style,
  checkedStyle,
  indicatorStyle,
  iconStyle,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedStyle?: StyleProp<ViewStyle>
  indicatorStyle?: StyleProp<ViewStyle>
  iconStyle?: StyleProp<TextStyle>
}) {
  const { colors } = useTheme()
  return (
    <CheckboxPrimitive.Root
      style={(state) => [
        styles.root,
        { backgroundColor: colors.inputStrong },
        props.checked && [
          { borderColor: colors.primary, backgroundColor: colors.primary },
          checkedStyle,
        ],
        props.disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        style={[
          styles.indicator,
          { backgroundColor: colors.primary },
          indicatorStyle,
        ]}
      >
        <TextStyleContext.Provider
          value={StyleSheet.flatten([
            { color: colors.primaryForeground },
            iconStyle,
          ])}
        >
          <Icon as={CheckIcon} size={14} weight="bold" />
        </TextStyleContext.Provider>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
