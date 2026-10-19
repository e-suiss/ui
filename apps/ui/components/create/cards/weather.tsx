import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export function Weather() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lisbon</CardTitle>
        <CardDescription>Sunday, 2:00 PM</CardDescription>
        <CardAction>
          <Badge variant="outline">
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
              phosphor="ArrowUpRightIcon"
              remixicon="RiArrowRightUpLine"
            />
            12 km/h
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="cn-font-heading text-6xl font-semibold tracking-tight tabular-nums">
              21°
            </span>
            <span className="text-sm text-muted-foreground">
              Partly cloudy · H 23° L 15°
            </span>
          </div>
          <IconPlaceholder
            lucide="CloudIcon"
            tabler="IconCloud"
            hugeicons="CloudIcon"
            phosphor="CloudIcon"
            remixicon="RiCloudLine"
            className="size-14 text-muted-foreground"
          />
        </div>
        <div className="grid grid-cols-6 gap-1 rounded-xl bg-muted p-2">
          <div className="flex flex-col items-center gap-1.5 rounded-lg bg-background py-2">
            <span className="text-xs font-medium">Now</span>
            <IconPlaceholder
              lucide="CloudIcon"
              tabler="IconCloud"
              hugeicons="CloudIcon"
              phosphor="CloudIcon"
              remixicon="RiCloudLine"
              className="size-4"
            />
            <span className="text-sm font-medium tabular-nums">21°</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs text-muted-foreground">3 PM</span>
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="size-4"
            />
            <span className="text-sm tabular-nums">22°</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs text-muted-foreground">4 PM</span>
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="size-4"
            />
            <span className="text-sm tabular-nums">23°</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs text-muted-foreground">5 PM</span>
            <IconPlaceholder
              lucide="CloudIcon"
              tabler="IconCloud"
              hugeicons="CloudIcon"
              phosphor="CloudIcon"
              remixicon="RiCloudLine"
              className="size-4"
            />
            <span className="text-sm tabular-nums">21°</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs text-muted-foreground">6 PM</span>
            <IconPlaceholder
              lucide="CloudIcon"
              tabler="IconCloud"
              hugeicons="CloudIcon"
              phosphor="CloudIcon"
              remixicon="RiCloudLine"
              className="size-4"
            />
            <span className="text-sm tabular-nums">19°</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs text-muted-foreground">7 PM</span>
            <IconPlaceholder
              lucide="MoonIcon"
              tabler="IconMoon"
              hugeicons="MoonIcon"
              phosphor="MoonIcon"
              remixicon="RiMoonLine"
              className="size-4"
            />
            <span className="text-sm tabular-nums">17°</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[3rem_1.25rem_2rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="font-medium">Mon</span>
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="size-4"
            />
            <span className="text-end text-muted-foreground tabular-nums">
              14°
            </span>
            <Progress value={70} aria-label="Monday range" />
            <span className="tabular-nums">24°</span>
          </div>
          <Separator />
          <div className="grid grid-cols-[3rem_1.25rem_2rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="font-medium">Tue</span>
            <IconPlaceholder
              lucide="CloudIcon"
              tabler="IconCloud"
              hugeicons="CloudIcon"
              phosphor="CloudIcon"
              remixicon="RiCloudLine"
              className="size-4"
            />
            <span className="text-end text-muted-foreground tabular-nums">
              15°
            </span>
            <Progress value={52} aria-label="Tuesday range" />
            <span className="tabular-nums">21°</span>
          </div>
          <Separator />
          <div className="grid grid-cols-[3rem_1.25rem_2rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="font-medium">Wed</span>
            <IconPlaceholder
              lucide="ZapIcon"
              tabler="IconBolt"
              hugeicons="ZapIcon"
              phosphor="LightningIcon"
              remixicon="RiFlashlightLine"
              className="size-4"
            />
            <span className="text-end text-muted-foreground tabular-nums">
              13°
            </span>
            <Progress value={40} aria-label="Wednesday range" />
            <span className="tabular-nums">18°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
