import { View } from "react-native"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"
import { Text } from "@/components/ui/text"

export default function ContextActionsInline() {
  return (
    <View className="items-start">
      <ContextActions>
        <ContextActionsTrigger className="rounded-lg bg-secondary px-3 py-2">
          <Text>Hold this message</Text>
        </ContextActionsTrigger>
        <ContextActionsContent cancelLabel="Close">
          <ContextActionsItem>Reply</ContextActionsItem>
          <ContextActionsItem>Forward</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </View>
  )
}
