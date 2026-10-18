import { View } from "react-native"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Plum",
]

export default function WheelPickerDemo() {
  return (
    <View className="w-80 rounded-2xl border border-foreground/5 bg-card p-4 shadow-md dark:border-foreground/10">
      <WheelPicker>
        <WheelPickerColumn accessibilityLabel="Fruit" defaultValue="Lemon">
          {fruits.map((fruit) => (
            <WheelPickerItem key={fruit} value={fruit}>
              {fruit}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    </View>
  )
}
