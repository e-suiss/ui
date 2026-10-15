import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleInteractive() {
  return (
    <div className="flex w-96 flex-col">
      <Bubble variant="outline" align="start">
        <BubbleContent render={(props) => <button type="button" {...props} />}>
          Show me the latest release notes
        </BubbleContent>
      </Bubble>
    </div>
  )
}
