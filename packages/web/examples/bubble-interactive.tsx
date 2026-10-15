import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleInteractive() {
  return (
    <div className="flex w-96 flex-col">
      <Bubble variant="outline" align="start">
        <BubbleContent render={<button type="button" />}>
          Show me the latest release notes
        </BubbleContent>
      </Bubble>
    </div>
  )
}
