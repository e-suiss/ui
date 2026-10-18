import { BookmarkSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
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

export default function ToggleWithText() {
  return (
    <View className="flex-row">
      <ToggleDemo variant="outline" accessibilityLabel="Bookmark">
        <ToggleIcon as={BookmarkSimpleIcon} />
        <Text>Bookmark</Text>
      </ToggleDemo>
    </View>
  )
}
