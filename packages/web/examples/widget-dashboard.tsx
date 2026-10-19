import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Widget,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

export default function WidgetDashboard() {
  return (
    <div className="grid max-w-4xl auto-rows-[10.5rem] grid-cols-2 gap-4 md:grid-cols-4">
      <Widget>
        <WidgetHeader>
          <WidgetIcon>
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="fill-current"
            />
          </WidgetIcon>
          <WidgetTitle>Istanbul</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>24°</WidgetValue>
        <WidgetFooter>Partly cloudy</WidgetFooter>
      </Widget>
      <Widget align="center">
        <WidgetHeader>
          <WidgetIcon size="lg">
            <IconPlaceholder
              lucide="CookingPotIcon"
              tabler="IconSoup"
              hugeicons="PotIcon"
              phosphor="CookingPotIcon"
              remixicon="RiBowlLine"
            />
          </WidgetIcon>
          <WidgetTitle>Kitchen display</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>5 tickets</WidgetDescription>
      </Widget>
      <Widget className="col-span-2">
        <WidgetHeader className="gap-1.5 text-amber-700 dark:text-amber-400">
          <WidgetIcon size="sm" className="text-amber-700 dark:text-amber-400">
            <IconPlaceholder
              lucide="CalculatorIcon"
              tabler="IconCashRegister"
              hugeicons="CashierIcon"
              phosphor="CashRegisterIcon"
              remixicon="RiCalculatorLine"
            />
          </WidgetIcon>
          <WidgetTitle>Hestia</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>₺18,240</WidgetValue>
        <WidgetFooter>Today's revenue · 42 orders</WidgetFooter>
      </Widget>
      <Widget className="col-span-2 row-span-2">
        <WidgetHeader className="gap-1.5 text-[color-mix(in_oklab,var(--primary)_80%,var(--foreground))]">
          <WidgetIcon size="sm" className="text-primary">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar01Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
            />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
        </WidgetHeader>
        <WidgetContent className="gap-2">
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
              18:00
            </span>
            <span className="truncate">Table 4</span>
          </div>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
              19:00
            </span>
            <span className="truncate">Takeaway</span>
          </div>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
              20:00
            </span>
            <span className="truncate">Table 12</span>
          </div>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
              21:00
            </span>
            <span className="truncate">Pickup</span>
          </div>
          <div className="flex items-baseline gap-3 text-sm">
            <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
              22:00
            </span>
            <span className="truncate">Garden 3</span>
          </div>
        </WidgetContent>
      </Widget>
      <Widget className="col-span-2 row-span-2" align="center">
        <WidgetHeader>
          <WidgetIcon size="lg">
            <IconPlaceholder
              lucide="CalculatorIcon"
              tabler="IconCashRegister"
              hugeicons="CashierIcon"
              phosphor="CashRegisterIcon"
              remixicon="RiCalculatorLine"
            />
          </WidgetIcon>
          <WidgetTitle>Point of sale</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>3 open orders</WidgetDescription>
      </Widget>
    </div>
  )
}
