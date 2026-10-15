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
    <div className="w-80 rounded-2xl bg-card p-4 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <WheelPicker>
        <WheelPickerColumn aria-label="Fruit" defaultValue="Lemon">
          {fruits.map((fruit) => (
            <WheelPickerItem key={fruit} value={fruit}>
              {fruit}
            </WheelPickerItem>
          ))}
        </WheelPickerColumn>
      </WheelPicker>
    </div>
  )
}
