import { StyleSheet } from "react-native"
import * as AvatarPrimitive from "@/components/primitives/avatar"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    position: "relative",
    display: "flex",
    width: 32,
    height: 32,
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: 9999,
  },
  image: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: 9999,
  },
  fallback: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
})

function Avatar({
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root style={[styles.root, style]} {...props} />
}

function AvatarImage({
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image style={[styles.image, style]} {...props} />
}

function AvatarFallback({
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.sm, color: colors.mutedForeground }}
    >
      <AvatarPrimitive.Fallback
        style={[styles.fallback, { backgroundColor: colors.muted }, style]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

export { Avatar, AvatarFallback, AvatarImage }
