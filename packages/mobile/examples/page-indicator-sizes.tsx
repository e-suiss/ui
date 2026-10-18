import { View } from "react-native"
import { PageIndicator } from "@/components/ui/page-indicator"

export default function PageIndicatorSizes() {
  return (
    <View className="items-center gap-6">
      <PageIndicator count={5} index={1} size="sm" />
      <PageIndicator count={5} index={1} />
    </View>
  )
}
