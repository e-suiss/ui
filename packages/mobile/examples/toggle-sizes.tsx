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

export default function ToggleSizes() {
  return (
    <View className="flex-row items-center gap-2">
      <ToggleDemo size="sm" variant="outline" accessibilityLabel="Small">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo variant="outline" accessibilityLabel="Default">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo size="lg" variant="outline" accessibilityLabel="Large">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
    </View>
  )
}
