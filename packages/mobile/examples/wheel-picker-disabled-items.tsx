import { View } from "react-native"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

const slots = Array.from({ length: 11 }, (_, index) => {
  const minutes = 18 * 60 + index * 30
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
})

const booked = new Set(["19:30", "20:00", "20:30"])

export default function WheelPickerDisabledItems() {
  return (
    <View className="w-80 rounded-2xl border border-foreground/5 bg-card p-4 shadow-md dark:border-foreground/10">
      <WheelPicker>
        <WheelPickerColumn
          accessibilityLabel="Reservation time"
          defaultValue="19:00"
        >
          {slots.map((slot) => (
            <WheelPickerItem
              key={slot}
              value={slot}
              disabled={booked.has(slot)}
            >
              {slot}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    </View>
  )
}
