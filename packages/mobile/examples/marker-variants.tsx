import { CalendarBlankIcon, InfoIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function MarkerVariants() {
  return (
    <View className="gap-8">
      <Marker>
        <MarkerIcon>
          <Icon as={InfoIcon} />
        </MarkerIcon>
        <MarkerContent>Messages are end-to-end encrypted.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <Icon as={CalendarBlankIcon} />
        </MarkerIcon>
        <MarkerContent>Upcoming</MarkerContent>
      </Marker>
    </View>
  )
}
