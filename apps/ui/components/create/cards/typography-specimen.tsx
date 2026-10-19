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

export function TypographySpecimen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
        <CardDescription>Type scale and weights</CardDescription>
        <CardAction>
          <Badge variant="outline">Sans</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <span className="cn-font-heading text-7xl leading-none font-semibold tracking-tight">
            Aa
          </span>
          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
            <span>ABCDEFGHIJKLM</span>
            <span>abcdefghijklm</span>
            <span className="tabular-nums">0123456789</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <span className="cn-font-heading text-2xl font-semibold tracking-tight">
              Heading
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              24 / 32
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-lg font-medium">Subheading</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              18 / 28
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm">Body text</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              14 / 20
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs text-muted-foreground">Caption</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              12 / 16
            </span>
          </div>
        </div>
        <Separator />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Good type stays out of the way. It sets a calm rhythm, makes long
          reading easy and lets the content speak first.
        </p>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted py-3">
            <span className="text-xl font-normal">Ag</span>
            <span className="text-xs text-muted-foreground">Regular</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted py-3">
            <span className="text-xl font-medium">Ag</span>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted py-3">
            <span className="text-xl font-semibold">Ag</span>
            <span className="text-xs text-muted-foreground">Semibold</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted py-3">
            <span className="text-xl font-bold">Ag</span>
            <span className="text-xs text-muted-foreground">Bold</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
