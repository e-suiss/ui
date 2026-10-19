import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"

export default function MessageDemo() {
  return (
    <Message align="start" className="w-96">
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>Are we still on for lunch tomorrow?</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
