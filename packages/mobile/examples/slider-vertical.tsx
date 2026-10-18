import { View } from "react-native"
import { Slider } from "@/components/ui/slider"

export default function SliderVertical() {
  return (
    <View className="h-48 flex-row justify-center gap-8">
      <Slider defaultValue={40} orientation="vertical" />
      <Slider defaultValue={[20, 70]} orientation="vertical" />
    </View>
  )
}
