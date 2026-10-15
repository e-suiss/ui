import {
  CalendarBlankIcon,
  CashRegisterIcon,
  CookingPotIcon,
  SunIcon,
} from "@phosphor-icons/react"
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
            <SunIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Istanbul</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>24°</WidgetValue>
        <WidgetFooter>Partly cloudy</WidgetFooter>
      </Widget>
      <Widget align="center">
        <WidgetHeader>
          <WidgetIcon size="lg">
            <CookingPotIcon />
          </WidgetIcon>
          <WidgetTitle>Kitchen display</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>5 tickets</WidgetDescription>
      </Widget>
      <Widget className="col-span-2">
        <WidgetHeader className="gap-1.5 text-warning">
          <WidgetIcon size="sm" className="text-warning">
            <CashRegisterIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Hestia</WidgetTitle>
        </WidgetHeader>
        <WidgetValue>₺18,240</WidgetValue>
        <WidgetFooter>Today's revenue · 42 orders</WidgetFooter>
      </Widget>
      <Widget className="col-span-2 row-span-2">
        <WidgetHeader className="gap-1.5 text-link">
          <WidgetIcon size="sm" className="text-link">
            <CalendarBlankIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
        </WidgetHeader>
        <WidgetContent className="gap-2">
          {tickets.slice(0, 5).map((ticket, index) => (
            <div key={ticket.id} className="flex items-baseline gap-3 text-sm">
              <span className="w-11 shrink-0 text-label-secondary tabular-nums">
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
            <CashRegisterIcon />
          </WidgetIcon>
          <WidgetTitle>Point of sale</WidgetTitle>
        </WidgetHeader>
        <WidgetDescription>3 open orders</WidgetDescription>
      </Widget>
    </div>
  )
}
