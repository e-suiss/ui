import type * as React from "react"
import { View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <View className="gap-2">
      <Text variant="muted">{label}</Text>
      {children}
    </View>
  )
}

export default function ChipStates() {
  return (
    <View className="gap-4">
      <Section label="Unselected">
        <Chip>Open now</Chip>
      </Section>
      <Section label="Selected">
        <Chip defaultSelected>Open now</Chip>
      </Section>
      <Section label="Disabled">
        <View className="flex-row gap-2">
          <Chip disabled>Open now</Chip>
          <Chip disabled defaultSelected>
            Open now
          </Chip>
        </View>
      </Section>
    </View>
  )
}
