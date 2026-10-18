import { CaretUpDownIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const repositories = ["esuiss/ui", "esuiss/docs", "esuiss/cli"]

function CollapsibleDemo({
  initialOpen = false,
  disabled = false,
}: {
  initialOpen?: boolean
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(initialOpen)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      className="w-full gap-2"
    >
      <View className="flex-row items-center justify-between gap-4 px-3">
        <Text className="text-sm font-medium">
          @ademceper starred 3 repositories
        </Text>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled={disabled}>
              <Icon as={CaretUpDownIcon} className="size-4" />
            </Button>
          }
        />
      </View>
      <View className="rounded-2xl bg-muted px-4 py-2">
        <Text className="text-sm">{repositories[0]}</Text>
      </View>
      <CollapsibleContent className="gap-2">
        {repositories.slice(1).map((repository) => (
          <View key={repository} className="rounded-2xl bg-muted px-4 py-2">
            <Text className="text-sm">{repository}</Text>
          </View>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function CollapsibleOpenByDefault() {
  return <CollapsibleDemo initialOpen />
}
