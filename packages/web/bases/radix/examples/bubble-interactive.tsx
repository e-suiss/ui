import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleInteractive() {
  return (
    <div className="flex w-96 flex-col">
      <Bubble variant="outline" align="start">
        <BubbleContent asChild>
          <button type="button">Show me the latest release notes</button>
        </BubbleContent>
      </Bubble>
    </div>
  )
}
