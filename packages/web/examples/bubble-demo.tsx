import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleDemo() {
  return (
    <div className="flex w-96 flex-col">
      <Bubble align="start">
        <BubbleContent>Are we still on for lunch tomorrow?</BubbleContent>
      </Bubble>
    </div>
  )
}
