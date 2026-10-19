import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function StatusPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System status</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
        <CardAction>
          <Badge variant="outline">
            <span className="size-1.5 rounded-full bg-primary" />
            Mostly operational
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium">API</span>
            <span className="text-muted-foreground tabular-nums">99.98%</span>
          </div>
          <div className="flex h-6 gap-0.5">
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary/40" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium">Dashboard</span>
            <span className="text-muted-foreground tabular-nums">100%</span>
          </div>
          <div className="flex h-6 gap-0.5">
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium">Notifications</span>
            <Badge variant="destructive">Degraded</Badge>
          </div>
          <div className="flex h-6 gap-0.5">
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary/40" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary" />
            <span className="flex-1 rounded-sm bg-primary/40" />
            <span className="flex-1 rounded-sm bg-destructive" />
            <span className="flex-1 rounded-sm bg-destructive" />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  )
}
