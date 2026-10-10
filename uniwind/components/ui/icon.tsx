import { cn } from "cn"
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { withUniwind } from "uniwind"
import { TextClassContext } from "@/components/ui/text"

type IconProps = PhosphorIconProps & {
  as: PhosphorIcon
  className?: string
}

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />
}

const StyledIcon = withUniwind(IconImpl, {
  size: {
    fromClassName: "className",
    styleProperty: "width",
  },
  color: {
    fromClassName: "className",
    styleProperty: "color",
  },
})

function Icon({ as: IconComponent, className, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext)
  return (
    <StyledIcon
      as={IconComponent}
      className={cn("size-5 text-foreground", textClass, className)}
      {...props}
    />
  )
}

export type { IconProps }
export { Icon }
