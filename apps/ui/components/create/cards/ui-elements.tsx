import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function UiElements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elements</CardTitle>
        <CardDescription>Controls in the current style</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs" variant="outline">
            Tiny
          </Button>
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="lg">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            Large
          </Button>
          <Button size="icon" variant="secondary" aria-label="Settings">
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="Settings01Icon"
              phosphor="GearIcon"
              remixicon="RiSettingsLine"
            />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">
            <IconPlaceholder
              lucide="CircleCheckIcon"
              tabler="IconCircleCheck"
              hugeicons="CheckmarkCircle02Icon"
              phosphor="CheckCircleIcon"
              remixicon="RiCheckboxCircleLine"
            />
            Verified
          </Badge>
          <Badge variant="destructive">Failed</Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label>
              <Switch defaultChecked />
              Sync
            </Label>
            <Label>
              <Checkbox defaultChecked />
              Remember me
            </Label>
            <Label>
              <Checkbox />
              Newsletter
            </Label>
          </div>
          <RadioGroup defaultValue="weekly" aria-label="Frequency">
            <Label>
              <RadioGroupItem value="daily" />
              Daily
            </Label>
            <Label>
              <RadioGroupItem value="weekly" />
              Weekly
            </Label>
            <Label>
              <RadioGroupItem value="monthly" />
              Monthly
            </Label>
          </RadioGroup>
        </div>
        <Slider defaultValue={[64]} aria-label="Volume" />
        <div className="flex items-center justify-between gap-3">
          <ToggleGroup
            spacing={0}
            multiple={false}
            defaultValue={["left"]}
            aria-label="Alignment"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              <IconPlaceholder
                lucide="TextAlignStartIcon"
                tabler="IconAlignLeft"
                hugeicons="TextAlignLeftIcon"
                phosphor="TextAlignLeftIcon"
                remixicon="RiAlignLeft"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <IconPlaceholder
                lucide="TextAlignCenterIcon"
                tabler="IconAlignCenter"
                hugeicons="TextAlignCenterIcon"
                phosphor="TextAlignCenterIcon"
                remixicon="RiAlignCenter"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <IconPlaceholder
                lucide="TextAlignEndIcon"
                tabler="IconAlignRight"
                hugeicons="TextAlignRightIcon"
                phosphor="TextAlignRightIcon"
                remixicon="RiAlignRight"
              />
            </ToggleGroupItem>
          </ToggleGroup>
          <KbdGroup>
            <Kbd mod />
            <Kbd>⇧</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </CardContent>
    </Card>
  )
}
