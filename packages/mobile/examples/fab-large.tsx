import { PencilSimpleIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Fab } from "@/components/ui/fab"
import { Text } from "@/components/ui/text"

function Page({ log }: { log?: string }) {
  return (
    <View className="gap-2">
      <Text variant="h3">Notes</Text>
      <Text variant="muted">
        The button floats at the bottom end of the screen.
      </Text>
      {log ? (
        <Text role="status" className="text-sm text-muted-foreground">
          {log}
        </Text>
      ) : null}
    </View>
  )
}

export default function FabLarge() {
  return (
    <View className="flex-1">
      <Page />
      <Fab size="lg" icon={PencilSimpleIcon} accessibilityLabel="Compose" />
    </View>
  )
}
