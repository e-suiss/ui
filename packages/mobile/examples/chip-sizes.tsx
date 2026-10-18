import { StarIcon } from "phosphor-react-native"
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

export default function ChipSizes() {
  return (
    <View className="gap-4">
      <Section label="Default">
        <View className="flex-row gap-2">
          <Chip icon={StarIcon}>Top rated</Chip>
          <Chip icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip onRemove={() => undefined}>Nearby</Chip>
        </View>
      </Section>
      <Section label="Small">
        <View className="flex-row gap-2">
          <Chip size="sm" icon={StarIcon}>
            Top rated
          </Chip>
          <Chip size="sm" icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip size="sm" onRemove={() => undefined}>
            Nearby
          </Chip>
        </View>
      </Section>
    </View>
  )
}
