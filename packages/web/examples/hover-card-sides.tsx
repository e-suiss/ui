import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function HoverCardSides() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-24">
      <HoverCard>
        <HoverCardTrigger
          href="#"
          className={buttonVariants({ variant: "outline" })}
        >
          Top
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-56">
          <p className="text-sm">
            This card opens on the top side of its trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          href="#"
          className={buttonVariants({ variant: "outline" })}
        >
          Right
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-56">
          <p className="text-sm">
            This card opens on the right side of its trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          href="#"
          className={buttonVariants({ variant: "outline" })}
        >
          Bottom
        </HoverCardTrigger>
        <HoverCardContent side="bottom" className="w-56">
          <p className="text-sm">
            This card opens on the bottom side of its trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          href="#"
          className={buttonVariants({ variant: "outline" })}
        >
          Left
        </HoverCardTrigger>
        <HoverCardContent side="left" className="w-56">
          <p className="text-sm">
            This card opens on the left side of its trigger.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
