import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export default function BubbleConversation() {
  return (
    <div className="flex w-96 flex-col">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>
            Hey, did you get a chance to review the draft?
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>
            Yes, I left a few comments on the intro.
          </BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Everything else looks great.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            Thanks! I will update it this afternoon.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
