import * as React from "react"
import { View } from "react-native"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

export default function PageIndicatorInteractive() {
  const [index, setIndex] = React.useState(0)
  return (
    <View className="items-center gap-3">
      <PageIndicator count={12} index={index} onIndexChange={setIndex} />
      <Text variant="muted">Page {index + 1} of 12</Text>
    </View>
  )
}
