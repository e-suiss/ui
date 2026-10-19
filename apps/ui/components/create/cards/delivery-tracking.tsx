import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export function DeliveryTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #48213</CardTitle>
        <CardDescription>Arriving Thursday, Oct 23</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              phosphor="TruckIcon"
              lucide="TruckIcon"
              tabler="IconTruck"
              hugeicons="DeliveryTruck01Icon"
              remixicon="RiTruckLine"
              data-icon="inline-start"
            />
            In transit
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-start">
          <div className="flex w-16 flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <IconPlaceholder
                phosphor="CheckIcon"
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                remixicon="RiCheckLine"
                className="size-4"
              />
            </div>
            <span className="text-xs">Ordered</span>
          </div>
          <div className="mt-4 h-0.5 flex-1 bg-primary" />
          <div className="flex w-16 flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <IconPlaceholder
                phosphor="CheckIcon"
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                remixicon="RiCheckLine"
                className="size-4"
              />
            </div>
            <span className="text-xs">Packed</span>
          </div>
          <div className="mt-4 h-0.5 flex-1 bg-primary" />
          <div className="flex w-16 flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-primary bg-card text-primary">
              <IconPlaceholder
                phosphor="TruckIcon"
                lucide="TruckIcon"
                tabler="IconTruck"
                hugeicons="DeliveryTruck01Icon"
                remixicon="RiTruckLine"
                className="size-4"
              />
            </div>
            <span className="font-medium text-xs">Shipped</span>
          </div>
          <div className="mt-4 h-0.5 flex-1 bg-muted" />
          <div className="flex w-16 flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <IconPlaceholder
                phosphor="HouseIcon"
                lucide="HouseIcon"
                tabler="IconHome"
                hugeicons="Home01Icon"
                remixicon="RiHomeLine"
                className="size-4"
              />
            </div>
            <span className="text-muted-foreground text-xs">Delivered</span>
          </div>
        </div>
        <Progress value={68}>
          <ProgressLabel>On the way to Lisbon</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Estimated arrival</span>
            <span className="font-medium">Thu, 2–6 PM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Last update</span>
            <span className="font-medium">Sorting hub, 08:14</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Contact courier
        </Button>
        <Button className="flex-1">Track live</Button>
      </CardFooter>
    </Card>
  )
}
