import { Bubble, BubbleContent } from "@/components/ui/bubble"

export default function BubbleInteractive() {
  return (
    <Bubble variant="outline" align="start">
      <BubbleContent onPress={() => undefined}>
        Show me the latest release notes
      </BubbleContent>
    </Bubble>
  )
}
