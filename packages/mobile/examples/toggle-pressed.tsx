import { TextBIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Toggle, ToggleIcon } from "@/components/ui/toggle"

type ToggleDemoProps = Omit<
  React.ComponentProps<typeof Toggle>,
  "pressed" | "onPressedChange"
> & {
  initial?: boolean
}

function ToggleDemo({ initial = false, children, ...props }: ToggleDemoProps) {
  const [pressed, setPressed] = React.useState(initial)
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} {...props}>
      {children}
    </Toggle>
  )
}

export default function TogglePressed() {
  return (
    <View className="flex-row">
      <ToggleDemo initial accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
    </View>
  )
}
