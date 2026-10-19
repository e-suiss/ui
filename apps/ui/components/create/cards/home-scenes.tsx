import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function HomeScenes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Living room</CardTitle>
        <CardDescription>3 of 4 devices on</CardDescription>
        <CardAction>
          <Switch defaultChecked aria-label="Room power" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ToggleGroup
          spacing={0}
          multiple={false}
          defaultValue={["evening"]}
          aria-label="Scene"
          className="w-full *:flex-1"
        >
          <ToggleGroupItem value="morning">Morning</ToggleGroupItem>
          <ToggleGroupItem value="evening">Evening</ToggleGroupItem>
          <ToggleGroupItem value="away">Away</ToggleGroupItem>
        </ToggleGroup>
        <div className="grid grid-cols-2 gap-2">
          <Toggle
            variant="outline"
            defaultPressed
            aria-label="Ceiling lights"
            className="h-auto flex-col items-start gap-3 p-3 text-start"
          >
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="size-5"
            />
            <span className="flex flex-col">
              <span className="font-medium">Lights</span>
              <span className="text-xs text-muted-foreground">On · 70%</span>
            </span>
          </Toggle>
          <Toggle
            variant="outline"
            defaultPressed
            aria-label="Speaker"
            className="h-auto flex-col items-start gap-3 p-3 text-start"
          >
            <IconPlaceholder
              lucide="Volume2Icon"
              tabler="IconVolume"
              hugeicons="VolumeHighIcon"
              phosphor="SpeakerHighIcon"
              remixicon="RiVolumeUpLine"
              className="size-5"
            />
            <span className="flex flex-col">
              <span className="font-medium">Speaker</span>
              <span className="text-xs text-muted-foreground">Playing</span>
            </span>
          </Toggle>
          <Toggle
            variant="outline"
            aria-label="Television"
            className="h-auto flex-col items-start gap-3 p-3 text-start"
          >
            <IconPlaceholder
              lucide="TvIcon"
              tabler="IconDeviceTv"
              hugeicons="Tv01Icon"
              phosphor="TelevisionIcon"
              remixicon="RiTvLine"
              className="size-5"
            />
            <span className="flex flex-col">
              <span className="font-medium">TV</span>
              <span className="text-xs text-muted-foreground">Off</span>
            </span>
          </Toggle>
          <Toggle
            variant="outline"
            defaultPressed
            aria-label="Front door"
            className="h-auto flex-col items-start gap-3 p-3 text-start"
          >
            <IconPlaceholder
              lucide="LockIcon"
              tabler="IconLock"
              hugeicons="SquareLock02Icon"
              phosphor="LockSimpleIcon"
              remixicon="RiLockLine"
              className="size-5"
            />
            <span className="flex flex-col">
              <span className="font-medium">Front door</span>
              <span className="text-xs text-muted-foreground">Locked</span>
            </span>
          </Toggle>
        </div>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Brightness</FieldLabel>
            <span className="text-sm text-muted-foreground tabular-nums">
              70%
            </span>
          </div>
          <Slider defaultValue={[70]} aria-label="Brightness" />
        </Field>
        <Separator />
        <Label className="justify-between">
          Turn off when everyone leaves
          <Switch size="sm" defaultChecked />
        </Label>
      </CardContent>
    </Card>
  )
}
