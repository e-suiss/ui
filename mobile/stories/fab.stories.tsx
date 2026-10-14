import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CameraIcon,
  FileTextIcon,
  ImageIcon,
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
        <Text role="status" className="text-sm text-label-secondary">
          {log}
        </Text>
      ) : null}
    </View>
  )
}

function SpeedDial({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [log, setLog] = React.useState("")
  return (
    <View className="flex-1">
      <Page log={log} />
      <Fab accessibilityLabel="Create" defaultOpen={defaultOpen}>
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

const meta = {
  title: "Components/Fab",
  component: Fab,
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="flex-1">
      <Page />
      <Fab accessibilityLabel="New note" />
    </View>
  ),
}

export const Large: Story = {
  render: () => (
    <View className="flex-1">
      <Page />
      <Fab size="lg" icon={PencilSimpleIcon} accessibilityLabel="Compose" />
    </View>
  ),
}

export const Extended: Story = {
  render: () => (
    <View className="flex-1">
      <Page />
      <Fab icon={PencilSimpleIcon} label="Compose" />
    </View>
  ),
}

export const LargeExtended: Story = {
  render: () => (
    <View className="flex-1">
      <Page />
      <Fab size="lg" label="New note" />
    </View>
  ),
}

export const SpeedDialOpen: Story = {
  render: () => <SpeedDial defaultOpen />,
}

export const SpeedDialClosed: Story = {
  render: () => <SpeedDial />,
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

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
