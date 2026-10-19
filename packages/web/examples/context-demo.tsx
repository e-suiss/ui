import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"

const usage = {
  input: 8420,
  output: 1260,
  reasoning: 980,
  limit: 128_000,
}

const used = usage.input + usage.output + usage.reasoning
const percent = Math.round((used / usage.limit) * 100)

const TRAILING_ZERO = /\.0$/

function formatTokens(value: number) {
  if (value < 1000) {
    return String(value)
  }

  return `${(value / 1000).toFixed(1).replace(TRAILING_ZERO, "")}k`
}

export default function ContextDemo() {
  return (
    <div className="flex justify-center py-12">
      <HoverCard>
        <HoverCardTrigger
          delay={10}
          closeDelay={100}
          render={<Button variant="outline" size="sm" />}
        >
          {percent}% context
        </HoverCardTrigger>
        <HoverCardContent className="flex w-64 flex-col gap-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Context</span>
            <span className="text-muted-foreground">
              {formatTokens(used)} / {formatTokens(usage.limit)}
            </span>
          </div>
          <Progress value={percent} aria-label="Context used" />
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Input</span>
              <span>{formatTokens(usage.input)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Output</span>
              <span>{formatTokens(usage.output)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Reasoning</span>
              <span>{formatTokens(usage.reasoning)}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
