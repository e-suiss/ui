import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export default function BubbleWithReactions() {
  return (
    <div className="flex w-96 flex-col">
      <BubbleGroup>
        <Bubble align="start" variant="muted">
          <BubbleContent>We just hit 10,000 users!</BubbleContent>
          <BubbleReactions>🎉 3</BubbleReactions>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>That is amazing news.</BubbleContent>
          <BubbleReactions align="start">❤️</BubbleReactions>
        </Bubble>
        <Bubble align="start" variant="secondary">
          <BubbleContent>Reactions can sit on top as well.</BubbleContent>
          <BubbleReactions side="top">👍 2</BubbleReactions>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
