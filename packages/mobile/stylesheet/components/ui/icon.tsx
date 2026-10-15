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

const IconSizeContext = React.createContext<number | undefined>(undefined)

function Icon({ as: IconComponent, size, color, ...props }: IconProps) {
  const { colors } = useTheme()
  const inherited = React.useContext(TextStyleContext)
  const inheritedSize = React.useContext(IconSizeContext)
  const inheritedColor =
    typeof inherited?.color === "string" ? inherited.color : undefined
  return (
    <IconComponent
      size={size ?? inheritedSize ?? 20}
      color={color ?? inheritedColor ?? colors.foreground}
      {...props}
    />
  )
}

export type { IconProps }
export { Icon, IconSizeContext }
