import {
  CalendarBlankIcon,
  CoffeeIcon,
  ForkKnifeIcon,
  MapPinIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Chip } from "@/components/ui/chip"

export default function ChipWithIcon() {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Chip icon={CoffeeIcon}>Coffee</Chip>
      <Chip icon={ForkKnifeIcon} defaultSelected>
        Restaurants
      </Chip>
      <Chip icon={MapPinIcon}>Nearby</Chip>
      <Chip icon={CalendarBlankIcon} disabled>
        Tonight
      </Chip>
    </View>
  )
}
