import {
  MapPinIcon,
  NavigationArrowIcon,
  StorefrontIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { PermissionPrimer } from "@/components/blocks/permission-primer"

export default function PermissionPrimerLocation() {
  return (
    <View className="-m-4 flex-1">
      <PermissionPrimer
        onAllow={() => undefined}
        onDismiss={() => undefined}
        icon={MapPinIcon}
        title="Find stores near you"
        description="Share your location to see pickup times and directions."
        benefits={[
          {
            icon: StorefrontIcon,
            title: "Nearby stores",
            description: "See which store has your item in stock today.",
          },
          {
            icon: NavigationArrowIcon,
            title: "Directions",
            description: "Get walking and driving routes in one tap.",
          },
        ]}
        allowLabel="Share Location"
        dismissLabel="Maybe later"
      />
    </View>
  )
}
