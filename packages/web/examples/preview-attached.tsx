import { CalendarBlankIcon } from "@phosphor-icons/react"
import {
  Preview,
  PreviewContent,
  PreviewTrigger,
} from "@/components/patterns/preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function ProfileCard() {
  return (
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
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarBlankIcon />
          Joined December 2021
        </div>
      </div>
    </div>
  )
}

export default function PreviewAttached() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Preview floating={false}>
        <PreviewTrigger href="#">@nextjs</PreviewTrigger>
        <PreviewContent>
          <ProfileCard />
        </PreviewContent>
      </Preview>
    </div>
  )
}
