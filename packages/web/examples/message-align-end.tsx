import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"

export default function MessageAlignEnd() {
  return (
    <div className="w-96">
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Yes, see you at noon.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
