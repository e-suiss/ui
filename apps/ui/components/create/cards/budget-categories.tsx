import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export function BudgetCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>October budget</CardTitle>
        <CardDescription>12 days left in this month</CardDescription>
        <CardAction>
          <Badge variant="outline">$2,400</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <IconPlaceholder
              phosphor="HandbagIcon"
              lucide="HandbagIcon"
              tabler="IconShoppingBag"
              hugeicons="ShoppingBag01Icon"
              remixicon="RiHandbagLine"
              className="size-4"
            />
          </div>
          <Progress value={68} className="flex-1 gap-2">
            <ProgressLabel>Groceries</ProgressLabel>
            <span className="ms-auto text-sm text-muted-foreground tabular-nums">
              $408 / $600
            </span>
          </Progress>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <IconPlaceholder
              phosphor="TruckIcon"
              lucide="TruckIcon"
              tabler="IconTruck"
              hugeicons="DeliveryTruck01Icon"
              remixicon="RiTruckLine"
              className="size-4"
            />
          </div>
          <Progress value={45} className="flex-1 gap-2">
            <ProgressLabel>Transport</ProgressLabel>
            <span className="ms-auto text-sm text-muted-foreground tabular-nums">
              $135 / $300
            </span>
          </Progress>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <IconPlaceholder
              phosphor="PizzaIcon"
              lucide="PizzaIcon"
              tabler="IconPizza"
              hugeicons="PizzaIcon"
              remixicon="RiRestaurantLine"
              className="size-4"
            />
          </div>
          <Progress value={92} className="flex-1 gap-2">
            <ProgressLabel>Dining out</ProgressLabel>
            <span className="ms-auto text-sm text-muted-foreground tabular-nums">
              $322 / $350
            </span>
          </Progress>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <IconPlaceholder
              phosphor="LightningIcon"
              lucide="ZapIcon"
              tabler="IconBolt"
              hugeicons="ZapIcon"
              remixicon="RiFlashlightLine"
              className="size-4"
            />
          </div>
          <Progress value={80} className="flex-1 gap-2">
            <ProgressLabel>Utilities</ProgressLabel>
            <span className="ms-auto text-sm text-muted-foreground tabular-nums">
              $200 / $250
            </span>
          </Progress>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <IconPlaceholder
              phosphor="TelevisionIcon"
              lucide="TvIcon"
              tabler="IconDeviceTv"
              hugeicons="Tv01Icon"
              remixicon="RiTvLine"
              className="size-4"
            />
          </div>
          <Progress value={30} className="flex-1 gap-2">
            <ProgressLabel>Entertainment</ProgressLabel>
            <span className="ms-auto text-sm text-muted-foreground tabular-nums">
              $45 / $150
            </span>
          </Progress>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            $1,290
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
