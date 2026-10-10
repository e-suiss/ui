import * as SeparatorPrimitive from "@rn-primitives/separator"
import { StyleSheet } from "react-native"
import { useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { flexShrink: 0 },
  horizontal: { height: 1, width: "100%" },
  vertical: { width: 1, alignSelf: "stretch" },
})

function Separator({
  style,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  const { colors } = useTheme()
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      style={[
        styles.root,
        { backgroundColor: colors.border },
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  )
}

export { Separator }
