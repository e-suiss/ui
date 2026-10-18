import { View } from "react-native"
import { PermissionPrimer } from "@/components/blocks/permission-primer"

export default function PermissionPrimerDemo() {
  return (
    <View className="-m-4 flex-1">
      <PermissionPrimer onAllow={() => undefined} onDismiss={() => undefined} />
    </View>
  )
}
