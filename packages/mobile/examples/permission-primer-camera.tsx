import {
  CameraIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  UserFocusIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { PermissionPrimer } from "@/components/blocks/permission-primer"

export default function PermissionPrimerCamera() {
  return (
    <View className="-m-4 flex-1">
      <PermissionPrimer
        onAllow={() => undefined}
        onDismiss={() => undefined}
        icon={CameraIcon}
        title="Scan and snap"
        description="Allow camera access to scan codes and add photos to your messages."
        benefits={[
          {
            icon: QrCodeIcon,
            title: "Scan codes",
            description: "Pay, sign in and join networks with a QR code.",
          },
          {
            icon: UserFocusIcon,
            title: "Profile photo",
            description: "Take a new picture without leaving the app.",
          },
          {
            icon: ShieldCheckIcon,
            title: "Only when you ask",
            description: "The camera is used only while this screen is open.",
          },
        ]}
        allowLabel="Allow Camera"
      />
    </View>
  )
}
