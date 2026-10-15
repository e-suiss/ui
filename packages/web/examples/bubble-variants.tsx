import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export default function BubbleVariants() {
  return (
    <div className="flex w-96 flex-col">
      <BubbleGroup>
        {(
          [
            "default",
            "secondary",
            "muted",
            "tinted",
            "outline",
            "ghost",
            "destructive",
          ] as const
        ).map((variant) => (
          <Bubble key={variant} align="start" variant={variant}>
            <BubbleContent>This is a {variant} bubble.</BubbleContent>
          </Bubble>
        ))}
      </BubbleGroup>
    </div>
  )
}
