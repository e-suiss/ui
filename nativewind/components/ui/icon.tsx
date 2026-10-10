import { cn } from "cn"
import { cssInterop } from "nativewind"
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { TextClassContext } from "@/components/ui/text"

type IconProps = PhosphorIconProps & {
  as: PhosphorIcon
  className?: string
}

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />
}

const StyledIcon = cssInterop(IconImpl, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      width: "size",
    },
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
