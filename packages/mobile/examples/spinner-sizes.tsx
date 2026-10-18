import { View } from "react-native"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerSizes() {
  return (
    <View className="flex-row items-center gap-6">
      <Spinner size={12} />
      <Spinner />
      <Spinner size={24} />
      <Spinner size={32} />
    </View>
  )
}
