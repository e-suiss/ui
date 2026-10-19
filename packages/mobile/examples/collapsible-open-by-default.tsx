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

export default function CollapsibleOpenByDefault() {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full gap-2">
      <View className="flex-row items-center justify-between gap-4 px-3">
        <Text className="text-sm font-medium">
          @ademceper starred 3 repositories
        </Text>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon-sm">
              <Icon as={CaretUpDownIcon} className="size-4" />
            </Button>
          }
        />
      </View>
      <View className="rounded-2xl bg-muted px-4 py-2">
        <Text className="text-sm">esuiss/ui</Text>
      </View>
      <CollapsibleContent className="gap-2">
        <View className="rounded-2xl bg-muted px-4 py-2">
          <Text className="text-sm">esuiss/docs</Text>
        </View>
        <View className="rounded-2xl bg-muted px-4 py-2">
          <Text className="text-sm">esuiss/cli</Text>
        </View>
      </CollapsibleContent>
    </Collapsible>
  )
}
