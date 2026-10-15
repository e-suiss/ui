import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="#"
        className={buttonVariants({ variant: "link" })}
      >
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar size="lg">
            <AvatarImage src="https://github.com/vercel.png" alt="@nextjs" />
            <AvatarFallback>NJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React framework, created and maintained by @vercel.
            </p>
            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <IconPlaceholder
                lucide="CalendarIcon"
                tabler="IconCalendar"
                hugeicons="Calendar01Icon"
                phosphor="CalendarBlankIcon"
                remixicon="RiCalendarLine"
              />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
