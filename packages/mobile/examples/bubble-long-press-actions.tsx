import { View } from "react-native"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"
import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleLongPressActions() {
  return (
    <View>
      <ContextActions>
        <Bubble variant="muted">
          <BubbleContent
            accessibilityLabel="Message from Maya"
            render={<ContextActionsTrigger />}
          >
            Hold this message to see its actions.
          </BubbleContent>
        </Bubble>
        <ContextActionsContent>
          <ContextActionsItem>Reply</ContextActionsItem>
          <ContextActionsItem>Copy</ContextActionsItem>
          <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </View>
  )
}
