import * as React from "react"
import { View } from "react-native"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Text } from "@/components/ui/text"

function InteractiveIndicator({ count }: { count: number }) {
  const [index, setIndex] = React.useState(0)
  return (
    <View className="items-center gap-3">
      <PageIndicator count={count} index={index} onIndexChange={setIndex} />
      <Text variant="muted">
        Page {index + 1} of {count}
      </Text>
    </View>
  )
}

export default function PageIndicatorInteractive() {
  return <InteractiveIndicator count={12} />
}
