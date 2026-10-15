import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function HoverCardSides() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            href="#"
            className={buttonVariants({ variant: "outline" })}
          >
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-56">
            <p className="text-sm">
              This card opens on the {side} side of its trigger.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
