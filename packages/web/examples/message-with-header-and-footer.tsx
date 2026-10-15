import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"

export default function MessageWithHeaderAndFooter() {
  return (
    <div className="w-96">
      <Message align="start">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Jordan Lee</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>
              I pushed the updated designs to the shared folder.
            </BubbleContent>
          </Bubble>
          <MessageFooter>9:41 AM</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
