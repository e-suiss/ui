import { StyleSheet } from "react-native"
import { Separator as SeparatorPrimitive } from "@/components/primitives/separator"
import { useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { flexShrink: 0 },
  horizontal: { height: 1, width: "100%" },
  vertical: { width: 1, alignSelf: "stretch" },
})

function Separator({
  style,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  const { colors } = useTheme()
  return (
    <SeparatorPrimitive
      style={(state) => [
        styles.root,
        { backgroundColor: colors.border },
        state.orientation === "horizontal"
          ? styles.horizontal
          : styles.vertical,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export { Separator }
