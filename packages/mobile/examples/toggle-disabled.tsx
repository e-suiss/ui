import { TextBIcon, TextItalicIcon } from "phosphor-react-native"
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

export default function ToggleDisabled() {
  return (
    <View className="flex-row gap-2">
      <ToggleDemo disabled accessibilityLabel="Toggle bold">
        <ToggleIcon as={TextBIcon} />
      </ToggleDemo>
      <ToggleDemo
        disabled
        initial
        variant="outline"
        accessibilityLabel="Toggle italic"
      >
        <ToggleIcon as={TextItalicIcon} />
      </ToggleDemo>
    </View>
  )
}
