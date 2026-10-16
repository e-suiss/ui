import { cn } from "cn"
import { ActivityIndicator, View } from "react-native"

const NATIVE_SIZE = 20

function Spinner({
  colorClassName = "accent-muted-foreground",
  className,
  style,
  size = 16,
  accessibilityLabel = "Loading",
  ...props
}: Omit<React.ComponentProps<typeof ActivityIndicator>, "size"> & {
  size?: number
  colorClassName?: string
}) {
  return (
    <View
      role="progressbar"
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      className={cn("shrink-0 items-center justify-center", className)}
      style={[{ width: size, height: size }, style]}
    >
      <ActivityIndicator
        colorClassName={colorClassName}
        size="small"
        style={{ transform: [{ scale: size / NATIVE_SIZE }] }}
        {...props}
      />
    </View>
  )
}

export { Spinner }
