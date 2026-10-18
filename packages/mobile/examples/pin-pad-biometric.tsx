import { ScanSmileyIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { PinPad } from "@/components/ui/pin-pad"
import { Text } from "@/components/ui/text"

function BiometricDemo({ faceId = false }: { faceId?: boolean }) {
  const [log, setLog] = React.useState(0)
  return (
    <View className="items-center gap-6">
      <Text className="text-sm text-muted-foreground">
        {log > 0 ? `Biometric requested (${log})` : "Biometric key"}
      </Text>
      <PinPad
        biometricIcon={faceId ? ScanSmileyIcon : undefined}
        biometricLabel={faceId ? "Use Face ID" : "Use Touch ID"}
        onBiometric={() => setLog((count) => count + 1)}
      />
    </View>
  )
}

export default function PinPadBiometric() {
  return <BiometricDemo />
}
