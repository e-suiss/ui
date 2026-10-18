import * as React from "react"
import { View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

function RemovableDemo() {
  const [tags, setTags] = React.useState([
    "Design",
    "Mobile",
    "Accessibility",
    "Motion",
  ])
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            onRemove={() =>
              setTags((current) => current.filter((item) => item !== tag))
            }
            removeLabel={`Remove ${tag}`}
          >
            {tag}
          </Chip>
        ))}
      </View>
      <Text variant="muted">{tags.length} tags</Text>
    </View>
  )
}

export default function ChipRemovable() {
  return <RemovableDemo />
}
