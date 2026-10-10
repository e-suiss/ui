import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { TextStyleContext } from "@/components/ui/text"
import { useTheme } from "@/components/ui/theme"

type IconProps = PhosphorIconProps & {
  as: PhosphorIcon
}

function Icon({ as: IconComponent, size = 20, color, ...props }: IconProps) {
  const { colors } = useTheme()
  const inherited = React.useContext(TextStyleContext)
  const inheritedColor =
    typeof inherited?.color === "string" ? inherited.color : undefined
  return (
    <IconComponent
      size={size}
      color={color ?? inheritedColor ?? colors.foreground}
      {...props}
    />
  )
}

export type { IconProps }
export { Icon }
