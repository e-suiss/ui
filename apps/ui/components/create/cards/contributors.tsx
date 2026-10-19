import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function Contributors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributors</CardTitle>
        <CardDescription>Changes merged in the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <AvatarGroup>
            <Avatar size="lg">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>JO</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>DB</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+8</AvatarGroupCount>
          </AvatarGroup>
          <div className="text-end">
            <p className="text-2xl font-semibold tabular-nums">412</p>
            <p className="text-xs text-muted-foreground">commits</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 truncate">Maya Reyes</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[92%] rounded-full bg-chart-1" />
            </div>
            <span className="w-8 text-end text-muted-foreground tabular-nums">
              138
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 truncate">Jonas Olsen</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[64%] rounded-full bg-chart-2" />
            </div>
            <span className="w-8 text-end text-muted-foreground tabular-nums">
              96
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 truncate">Aiko Kato</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[47%] rounded-full bg-chart-3" />
            </div>
            <span className="w-8 text-end text-muted-foreground tabular-nums">
              71
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 truncate">Daniel Brooks</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[35%] rounded-full bg-chart-4" />
            </div>
            <span className="w-8 text-end text-muted-foreground tabular-nums">
              52
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 truncate text-muted-foreground">
              8 others
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[37%] rounded-full bg-chart-5" />
            </div>
            <span className="w-8 text-end text-muted-foreground tabular-nums">
              55
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Up 18% from last month
      </CardFooter>
    </Card>
  )
}
