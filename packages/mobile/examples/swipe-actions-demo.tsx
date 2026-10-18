import {
  ArchiveIcon,
  BellSlashIcon,
  EnvelopeOpenIcon,
  TrashIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

const MESSAGES = [
  { id: "1", from: "Olivia Martin", subject: "Quarterly report is ready" },
  { id: "2", from: "Jackson Lee", subject: "Lunch on Friday?" },
  { id: "3", from: "Isabella Nguyen", subject: "Design review notes" },
]

function Inbox() {
  const [messages, setMessages] = React.useState(MESSAGES)
  const remove = (id: string) =>
    setMessages((current) => current.filter((message) => message.id !== id))
  return (
    <ItemGroup variant="inset">
      {messages.map((message, index) => (
        <React.Fragment key={message.id}>
          {index > 0 ? <ItemSeparator /> : null}
          <SwipeActions>
            <SwipeActionsActions side="leading">
              <SwipeAction>
                <Icon as={EnvelopeOpenIcon} />
                <Text>Read</Text>
              </SwipeAction>
            </SwipeActionsActions>
            <SwipeActionsContent className="bg-muted">
              <Item onPress={() => undefined}>
                <ItemContent>
                  <ItemTitle>{message.from}</ItemTitle>
                  <ItemDescription>{message.subject}</ItemDescription>
                </ItemContent>
              </Item>
            </SwipeActionsContent>
            <SwipeActionsActions side="trailing">
              <SwipeAction variant="neutral">
                <Icon as={BellSlashIcon} />
                <Text>Mute</Text>
              </SwipeAction>
              <SwipeAction variant="archive">
                <Icon as={ArchiveIcon} />
                <Text>Archive</Text>
              </SwipeAction>
              <SwipeAction
                variant="destructive"
                fullSwipe
                onPress={() => remove(message.id)}
              >
                <Icon as={TrashIcon} />
                <Text>Delete</Text>
              </SwipeAction>
            </SwipeActionsActions>
          </SwipeActions>
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}

export default function SwipeActionsDemo() {
  return (
    <View>
      <Inbox />
    </View>
  )
}
