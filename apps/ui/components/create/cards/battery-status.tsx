import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"

export function BatteryStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batteries</CardTitle>
        <CardDescription>4 devices nearby</CardDescription>
        <CardAction>
          <IconPlaceholder
            phosphor="BluetoothIcon"
            lucide="BluetoothIcon"
            tabler="IconBluetooth"
            hugeicons="BluetoothIcon"
            remixicon="RiBluetoothLine"
            className="size-4 text-muted-foreground"
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="DeviceMobileIcon"
                lucide="SmartphoneIcon"
                tabler="IconDeviceMobile"
                hugeicons="SmartPhone01Icon"
                remixicon="RiSmartphoneLine"
              />
            </ItemMedia>
            <ItemContent className="gap-2">
              <div className="flex items-center justify-between">
                <ItemTitle>Phone</ItemTitle>
                <span className="text-muted-foreground text-sm tabular-nums">
                  86%
                </span>
              </div>
              <Progress value={86} aria-label="Phone battery" />
            </ItemContent>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="ClockIcon"
                lucide="ClockIcon"
                tabler="IconClock"
                hugeicons="Clock01Icon"
                remixicon="RiTimeLine"
              />
            </ItemMedia>
            <ItemContent className="gap-2">
              <div className="flex items-center justify-between">
                <ItemTitle>Watch</ItemTitle>
                <span className="text-muted-foreground text-sm tabular-nums">
                  42%
                </span>
              </div>
              <Progress value={42} aria-label="Watch battery" />
            </ItemContent>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="MusicNoteIcon"
                lucide="MusicIcon"
                tabler="IconMusic"
                hugeicons="MusicNote01Icon"
                remixicon="RiMusic2Line"
              />
            </ItemMedia>
            <ItemContent className="gap-2">
              <div className="flex items-center justify-between">
                <ItemTitle>Earbuds</ItemTitle>
                <span className="text-muted-foreground text-sm tabular-nums">
                  18%
                </span>
              </div>
              <Progress value={18} aria-label="Earbuds battery" />
            </ItemContent>
          </Item>
          <Item size="sm" role="listitem">
            <ItemMedia variant="icon">
              <IconPlaceholder
                phosphor="BatteryFullIcon"
                lucide="BatteryFullIcon"
                tabler="IconBattery4"
                hugeicons="BatteryFullIcon"
                remixicon="RiBatteryFill"
              />
            </ItemMedia>
            <ItemContent className="gap-2">
              <div className="flex items-center justify-between">
                <ItemTitle>Charging case</ItemTitle>
                <span className="flex items-center gap-1 text-muted-foreground text-sm tabular-nums">
                  <IconPlaceholder
                    phosphor="LightningIcon"
                    lucide="ZapIcon"
                    tabler="IconBolt"
                    hugeicons="ZapIcon"
                    remixicon="RiFlashlightLine"
                    className="size-3.5"
                  />
                  71%
                </span>
              </div>
              <Progress value={71} aria-label="Charging case battery" />
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
