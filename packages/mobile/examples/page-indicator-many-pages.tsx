import { View } from "react-native"
import { PageIndicator } from "@/components/ui/page-indicator"

export default function PageIndicatorManyPages() {
  return (
    <View className="items-center gap-6">
      <PageIndicator count={12} index={0} />
      <PageIndicator count={12} index={5} />
      <PageIndicator count={12} index={11} />
    </View>
  )
}
