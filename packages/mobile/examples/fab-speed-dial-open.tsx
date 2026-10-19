import {
  CameraIcon,
  FileTextIcon,
  ImageIcon,
  NotePencilIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Fab, FabAction } from "@/components/ui/fab"
import { Text } from "@/components/ui/text"

export default function FabSpeedDialOpen() {
  const [log, setLog] = React.useState("")
  return (
    <View className="flex-1">
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
      <Fab accessibilityLabel="Create" defaultOpen>
        <FabAction icon={NotePencilIcon} onPress={() => setLog("New note")}>
          New note
        </FabAction>
        <FabAction icon={CameraIcon} onPress={() => setLog("Take photo")}>
          Take photo
        </FabAction>
        <FabAction icon={ImageIcon} onPress={() => setLog("Add image")}>
          Add image
        </FabAction>
        <FabAction icon={FileTextIcon} onPress={() => setLog("Scan document")}>
          Scan document
        </FabAction>
      </Fab>
    </View>
  )
}
