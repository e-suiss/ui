import { ChecksIcon } from "phosphor-react-native"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Icon } from "@/components/ui/icon"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message"
import { Text } from "@/components/ui/text"

export default function MessageConversation() {
  return (
    <MessageGroup className="gap-4">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Did the build pass?</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>I want to ship before the weekend.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>All green. Merging it now.</BubbleContent>
          </Bubble>
          <MessageFooter className="gap-1">
            <Icon as={ChecksIcon} className="text-primary" />
            <Text>Read 10:02 AM</Text>
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
