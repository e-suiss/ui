import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message"

export default function MessageConversation() {
  return (
    <div className="w-96">
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
            <MessageFooter>Read 10:02 AM</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  )
}
