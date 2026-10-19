import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function Thermostat() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Climate</CardTitle>
        <CardDescription>Bedroom · Updated just now</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              lucide="FlameIcon"
              tabler="IconFlame"
              hugeicons="FireIcon"
              phosphor="FlameIcon"
              remixicon="RiFireLine"
            />
            Heating
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="icon-lg" aria-label="Lower target">
            <IconPlaceholder
              lucide="MinusIcon"
              tabler="IconMinus"
              hugeicons="MinusSignIcon"
              phosphor="MinusIcon"
              remixicon="RiSubtractLine"
            />
          </Button>
          <div className="flex flex-col items-center">
            <span className="cn-font-heading text-6xl font-semibold tracking-tight tabular-nums">
              21.5°
            </span>
            <span className="text-sm text-muted-foreground">
              Heating to 22°
            </span>
          </div>
          <Button variant="outline" size="icon-lg" aria-label="Raise target">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
        </div>
        <ToggleGroup
          spacing={0}
          multiple={false}
          defaultValue={["heat"]}
          aria-label="Mode"
          className="w-full *:flex-1"
        >
          <ToggleGroupItem value="heat">
            <IconPlaceholder
              lucide="FlameIcon"
              tabler="IconFlame"
              hugeicons="FireIcon"
              phosphor="FlameIcon"
              remixicon="RiFireLine"
              data-icon="inline-start"
            />
            Heat
          </ToggleGroupItem>
          <ToggleGroupItem value="cool">
            <IconPlaceholder
              lucide="SparkleIcon"
              tabler="IconSparkles"
              hugeicons="SparklesIcon"
              phosphor="SparkleIcon"
              remixicon="RiSparklingLine"
              data-icon="inline-start"
            />
            Cool
          </ToggleGroupItem>
          <ToggleGroupItem value="auto">
            <IconPlaceholder
              lucide="RefreshCcwIcon"
              tabler="IconRefresh"
              hugeicons="RefreshIcon"
              phosphor="ArrowsClockwiseIcon"
              remixicon="RiRefreshLine"
              data-icon="inline-start"
            />
            Auto
          </ToggleGroupItem>
        </ToggleGroup>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Target</FieldLabel>
            <span className="text-sm text-muted-foreground tabular-nums">
              22°
            </span>
          </div>
          <Slider
            defaultValue={[22]}
            min={16}
            max={28}
            step={0.5}
            aria-label="Target temperature"
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>16°</span>
            <span>28°</span>
          </div>
        </Field>
        <Separator />
        <Progress value={46}>
          <ProgressLabel>Humidity</ProgressLabel>
          <ProgressValue />
        </Progress>
      </CardContent>
    </Card>
  )
}
