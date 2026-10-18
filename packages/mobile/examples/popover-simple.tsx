import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

export default function PopoverSimple() {
  return (
    <View className="items-start">
      <Popover>
        <PopoverTrigger render={<Button />}>
          <Text>Info</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <Text className="text-sm">
            Popovers display rich content next to a trigger.
          </Text>
        </PopoverContent>
      </Popover>
    </View>
  )
}
