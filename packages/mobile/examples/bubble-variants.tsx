import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const

export default function BubbleVariants() {
  return (
    <BubbleGroup>
      {VARIANTS.map((variant) => (
        <Bubble key={variant} align="start" variant={variant}>
          <BubbleContent>This is a {variant} bubble.</BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  )
}
