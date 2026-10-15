import { ActivityIndicator, View } from "react-native"
import { useTheme } from "@/components/ui/theme"

const NATIVE_SIZE = 20

function Spinner({
  color,
  style,
  size = 16,
  accessibilityLabel = "Loading",
  ...props
}: Omit<React.ComponentProps<typeof ActivityIndicator>, "size"> & {
  size?: number
}) {
  const { colors } = useTheme()
  return (
    <View
      role="progressbar"
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[
        {
          width: size,
          height: size,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <ActivityIndicator
        color={color ?? colors.mutedForeground}
        size="small"
        style={{ transform: [{ scale: size / NATIVE_SIZE }] }}
        {...props}
      />
    </View>
  )
}

export { Spinner }
