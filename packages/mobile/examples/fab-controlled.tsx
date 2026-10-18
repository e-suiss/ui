import {
  CameraIcon,
  NotePencilIcon,
  PencilSimpleIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Fab, FabAction } from "@/components/ui/fab"
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

function ControlledDemo() {
  const [open, setOpen] = React.useState(true)
  return (
    <View className="flex-1">
      <Page log={open ? "Open" : "Closed"} />
      <Fab
        icon={PencilSimpleIcon}
        label="Create"
        open={open}
        onOpenChange={setOpen}
      >
        <FabAction icon={NotePencilIcon}>New note</FabAction>
        <FabAction icon={CameraIcon}>Take photo</FabAction>
      </Fab>
    </View>
  )
}

export default function FabControlled() {
  return <ControlledDemo />
}
