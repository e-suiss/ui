import { ImageIcon } from "phosphor-react-native"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ContextActionsDemo() {
  return (
    <ContextActions>
      <ContextActionsTrigger
        accessibilityLabel="Photo"
        className="h-40 items-center justify-center gap-2 rounded-2xl bg-muted active:opacity-80"
      >
        <Icon as={ImageIcon} className="size-8 text-muted-foreground" />
        <Text className="text-sm text-muted-foreground">Long press</Text>
      </ContextActionsTrigger>
      <ContextActionsContent>
        <ContextActionsLabel>Photo</ContextActionsLabel>
        <ContextActionsItem>Copy</ContextActionsItem>
        <ContextActionsItem>Share</ContextActionsItem>
        <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
      </ContextActionsContent>
    </ContextActions>
  )
}
