import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

export default function PopoverSides() {
  return (
    <View className="items-center gap-4 py-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline" />}>
            <Text className="capitalize">{side}</Text>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-56">
            <Text className="text-sm">Popover on the {side}.</Text>
          </PopoverContent>
        </Popover>
      ))}
    </View>
  )
}
