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

const tickets = [
  { id: "#1042", place: "Table 4", minutes: 18 },
  { id: "#1043", place: "Takeaway", minutes: 15 },
  { id: "#1044", place: "Table 12", minutes: 9 },
  { id: "#1045", place: "Pickup", minutes: 7 },
  { id: "#1046", place: "Garden 3", minutes: 5 },
  { id: "#1047", place: "Table 7", minutes: 3 },
  { id: "#1048", place: "Takeaway", minutes: 1 },
]

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
        <WidgetHeader className="gap-1.5 text-amber-600 dark:text-amber-400">
          <WidgetIcon size="sm" className="text-amber-600 dark:text-amber-400">
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
        <WidgetHeader className="gap-1.5 text-primary">
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
          {tickets.slice(0, 5).map((ticket, index) => (
            <div key={ticket.id} className="flex items-baseline gap-3 text-sm">
              <span className="w-11 shrink-0 text-muted-foreground tabular-nums">
                {`${18 + index}:00`}
              </span>
              <span className="truncate">{ticket.place}</span>
            </div>
          ))}
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
