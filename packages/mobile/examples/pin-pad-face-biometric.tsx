import { ScanSmileyIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { PinPad } from "@/components/ui/pin-pad"
import { Text } from "@/components/ui/text"

export default function PinPadFaceBiometric() {
  const [log, setLog] = React.useState(0)
  return (
    <View className="items-center gap-6">
      <Text className="text-sm text-muted-foreground">
        {log > 0 ? `Biometric requested (${log})` : "Biometric key"}
      </Text>
      <PinPad
        biometricIcon={ScanSmileyIcon}
        biometricLabel="Use Face ID"
        onBiometric={() => setLog((count) => count + 1)}
      />
    </View>
  )
}
