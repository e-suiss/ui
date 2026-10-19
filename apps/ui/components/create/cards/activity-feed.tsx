import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>What your team did today.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Filter">
            <IconPlaceholder
              phosphor="ListIcon"
              lucide="MenuIcon"
              tabler="IconMenu2"
              hugeicons="Menu01Icon"
              remixicon="RiMenuLine"
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          <li className="relative flex gap-3 pb-5 before:absolute before:start-4 before:top-10 before:bottom-1 before:w-px before:bg-border">
            <Avatar>
              <AvatarFallback>MR</AvatarFallback>
              <AvatarBadge className="bg-primary ring-card" />
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm">
                <span className="font-medium">Maya Reyes</span>{" "}
                <span className="text-muted-foreground">commented on</span>{" "}
                <span className="font-medium">Q4 roadmap</span>
              </p>
              <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Let&apos;s move the mobile beta to the second week.
              </p>
              <time className="text-xs text-muted-foreground">9:42 AM</time>
            </div>
          </li>
          <li className="relative flex gap-3 pb-5 before:absolute before:start-4 before:top-10 before:bottom-1 before:w-px before:bg-border">
            <Avatar>
              <AvatarFallback>JO</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm">
                <span className="font-medium">Jonas Olsen</span>{" "}
                <span className="text-muted-foreground">uploaded</span>{" "}
                <span className="font-medium">brand-guide.pdf</span>
              </p>
              <time className="text-xs text-muted-foreground">8:15 AM</time>
            </div>
          </li>
          <li className="relative flex gap-3 pb-5 before:absolute before:start-4 before:top-10 before:bottom-1 before:w-px before:bg-border">
            <Avatar>
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm">
                <span className="font-medium">Aiko Kato</span>{" "}
                <span className="text-muted-foreground">completed</span>{" "}
                <span className="font-medium">Pricing page copy</span>
              </p>
              <time className="text-xs text-muted-foreground">Yesterday</time>
            </div>
          </li>
          <li className="flex gap-3">
            <Avatar>
              <AvatarFallback>DB</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm">
                <span className="font-medium">Daniel Brooks</span>{" "}
                <span className="text-muted-foreground">joined</span>{" "}
                <span className="font-medium">Design</span>
              </p>
              <time className="text-xs text-muted-foreground">Yesterday</time>
            </div>
          </li>
        </ol>
      </CardContent>
    </Card>
  )
}
