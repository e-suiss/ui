import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export default function BubbleVariants() {
  return (
    <BubbleGroup className="w-96">
      <Bubble align="start" variant="default">
        <BubbleContent>This is a default bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="secondary">
        <BubbleContent>This is a secondary bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="muted">
        <BubbleContent>This is a muted bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="tinted">
        <BubbleContent>This is a tinted bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="outline">
        <BubbleContent>This is a outline bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="ghost">
        <BubbleContent>This is a ghost bubble.</BubbleContent>
      </Bubble>
      <Bubble align="start" variant="destructive">
        <BubbleContent>This is a destructive bubble.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
