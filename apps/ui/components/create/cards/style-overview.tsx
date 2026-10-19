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

export function StyleOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Colors, charts and radius in use</CardDescription>
        <CardAction>
          <Badge variant="secondary">Tokens</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg border bg-background" />
            <span className="truncate text-xs text-muted-foreground">
              Background
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-foreground" />
            <span className="truncate text-xs text-muted-foreground">
              Foreground
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-primary" />
            <span className="truncate text-xs text-muted-foreground">
              Primary
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-secondary" />
            <span className="truncate text-xs text-muted-foreground">
              Secondary
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-muted" />
            <span className="truncate text-xs text-muted-foreground">
              Muted
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-accent" />
            <span className="truncate text-xs text-muted-foreground">
              Accent
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg bg-destructive" />
            <span className="truncate text-xs text-muted-foreground">
              Destructive
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-lg border-2 border-border bg-background" />
            <span className="truncate text-xs text-muted-foreground">
              Border
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium">Chart</span>
          <div className="grid grid-cols-5 gap-2">
            <div className="flex flex-col gap-1.5">
              <div className="h-10 rounded-md bg-chart-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                1
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-10 rounded-md bg-chart-2" />
              <span className="text-xs text-muted-foreground tabular-nums">
                2
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-10 rounded-md bg-chart-3" />
              <span className="text-xs text-muted-foreground tabular-nums">
                3
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-10 rounded-md bg-chart-4" />
              <span className="text-xs text-muted-foreground tabular-nums">
                4
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-10 rounded-md bg-chart-5" />
              <span className="text-xs text-muted-foreground tabular-nums">
                5
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium">Radius</span>
          <div className="grid grid-cols-4 gap-x-3 gap-y-4">
            <div className="flex flex-col gap-1.5">
              <div className="size-14 rounded-md border-2 border-primary bg-primary/10" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="size-14 rounded-lg border-2 border-primary bg-primary/10" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="size-14 rounded-2xl border-2 border-primary bg-primary/10" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="size-14 rounded-full border-2 border-primary bg-primary/10" />
              <span className="text-xs text-muted-foreground">Full</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
